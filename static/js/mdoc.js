let div = document.getElementById('container');

// 判断url是否是绝对路径
function isAbsolute(url) {
  return /(^[\/\\].*)|(.*:.*)/.test(url);
}

// ajax请求markdown文件，并且显示到网页上
function ajaxMD() {
  // 用hash路由来保存请求的markdown文件的路径
  // 如果不打算请求任何文件，就请求index.md
  if (location.hash == '' || location.hash == '#') {
    location.hash = '#!index.md';
  }

  // 从hash路由中获取文件路径
  let hash = location.hash;
  hash = hash.replace('#', '');
  hash = hash.replace('!', '');
  // console.log(hash);

  // 从文件路径中获取文件所在文件夹
  str_arr = hash.split('/');
  var path = '';
  if (str_arr.length > 1) {
    str_arr.pop();
    path=str_arr.join('/');
    path = path + '/';
  }
  // console.log(path);

  // ajax请求文件
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'content/' + hash, true);
  xhr.send();
  // 等待数据响应
  xhr.onreadystatechange = function() {
    // console.log(xhr)
    /* readyState 属性(请求状态)：
    0 (初始化)还没有调用open()方法
    1 (载入)已调用open()方法，尚未发送请求
    2 (载入完成)send()方法完成，已发送请求
    3 (解析)正在解析响应内容，先收到响应头
    4 (解析完成)解析完成，收到响应体
    */
    if (xhr.readyState == 4) {
      // 请求完成
      if (xhr.status == 200) {
        // 请求文件成功
        // 用marked把markdown转成html
        div.innerHTML = marked(xhr.responseText);
        // 处理html中超链接
        var aItems=$('#container a');
        aItems.each(function(){
          var aItem=$(this);
          var href=aItem.attr('href');
          // console.log(href);
          if (!isAbsolute(href)) {
            // 只处理相对路径
            if (href.endsWith(".md")) {
              // 对于md文件的超链接，设置路由
              href = "#!" + path + href;
              aItem.attr('href', href);
            } else if (href.endsWith(".pdf")) {
              // 对于其他格式的超链接（以pdf为例），拼接相对路径，设置正确的链接
              href = "content/" + path + href;
              aItem.attr('href', href);
            }
          }
        });
        // 处理html中图片链接
        var imgItems=$('#container img');
        imgItems.each(function(){
          var imgItem=$(this);
          var src=imgItem.attr('src');
          // console.log(src);
          if (!isAbsolute(src)) {
            // 只处理相对路径，拼接相对路径，设置正确的链接
            src = "content/" + path + src;
            imgItem.attr('src', src);
          }
        });
        // 由于ajax是动态生成页面，mathjax需要重新渲染公式
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
        // highlight也需要重新给代码高亮
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
        // 重新build侧边栏
        buildSidebar();
      } else {
        // 请求文件失败，转而请求一个早已准备好的错误页面404.md
        window.location.href="#!404.md";
      }
    }
  }
}

// build顶部导航条
function buildNavbar() {
  var el = $( '<div></div>' );
  // ajax请求content/navigation.md，获取导航条内容
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'content/navigation.md', true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      // 导航条内容转html后放在el里面
      el.html(marked(xhr.responseText));
      // 把导航条的brand部分设置为navigation.md的标题
      $('.navbar-brand').html($('h1', el).html());
      // 修改一下ul的属性
      $('ul', el).eq(0).attr('class', 'nav navbar-nav');
      $("li", el).each(function(){
        if ($(this).children('ul').length > 0) {
          $(this).attr('class', 'dropdown');
          $(this).find('a').eq(0).attr('class', 'dropdown-toggle');
          $(this).find('a').eq(0).attr('data-toggle', 'dropdown');
          $(this).find('a').eq(0).append($( '<b class="caret"></b>' ));
          $(this).find('ul').attr('class', 'dropdown-menu');
        }
      });
      // 把修改过后的ul放到顶部导航条#navbar里面
      $('#navbar').append($('ul', el).eq(0));
      // 对于md文件的超链接，设置路由
      var aItems=$('#navbar a');
      aItems.each(function(){
        var aItem=$(this);
        var href=aItem.attr('href');
        if (!isAbsolute(href) && href.endsWith(".md")) {
          href = "#!" + href;
          aItem.attr('href', href);
        }
      });
    }
  };
}

// build侧边栏
function buildSidebar() {
  // 取出h1
  var h1Items=$('#container h1');
  var tot = 0;
  if (h1Items.length > 0) {
    // 把sidebar设置为可见
    $('#sidebar-wrapper').css('display', 'block');
    $('#container-wrapper').attr('class', 'col-md-9');
    // 拼装sidebar的内容
    var content = '<ul class="nav bs-docs-sidenav">';
    for(var i=0;i<h1Items.length;i++) {
      var li_content = '<li>';
      var h1 = $(h1Items[i]).text();
      // 如果h1太长就截取一部分显示
      if (h1.length > 25) {
        h1 = h1.substr(0,25);
        h1 = h1 + '...';
      }
      var hash = location.hash;
      hash = hash.replace('#', '');
      // 取名，防止重复
      var id = 'anchor-' + tot;
      // console.log(h1);
      // 每一个h1都对应一个li，把li的href和h1的id改成相同的，就可以滚动监听
      // 设置li点击时滚动到该h1的位置，并且return false阻止li的href跳转
      li_content += '<a href="#' + id + '" onclick="document.getElementById(\'' + id + '\').scrollIntoView();return false">' + h1 + '</a>';
      $(h1Items[i]).attr('id', id);
      ++tot;
      // 取出两个相邻的h1之间的h2，实现嵌套列表
      var h2Items = $(h1Items[i]).nextUntil(h1Items[i+1], "h2");
      if (h2Items.length > 0) {
        var sub_content = '<ul class="nav">';
        for(var j=0;j<h2Items.length;j++) {
          var sub_li_content = '<li>';
          var h2 = $(h2Items[j]).text();
          // 如果h2太长就截取一部分显示
          if (h2.length > 20) {
            h2 = h2.substr(0,20);
            h2 = h2 + '...';
          }
          var sub_id = 'anchor-' + tot;
          // console.log(h2);
          // 每一个h2都对应一个li，把li的href和h2的id改成相同的，就可以滚动监听
          // 设置li点击时滚动到该h2的位置，并且return false阻止li的href跳转
          sub_li_content += '<a href="#' + sub_id + '" onclick="document.getElementById(\'' + sub_id + '\').scrollIntoView();return false">' + h2 + '</a>';
          $(h2Items[j]).attr('id', sub_id);
          ++tot;
          sub_li_content += '</li>'
          sub_content += sub_li_content;
        }
        sub_content += '</ul>';
        li_content += sub_content;
      }
      li_content += '</li>';
      content += li_content;
    }
    content += '</ul>';
    // 给侧边栏添加返回顶部的功能
    content += '<a class="back-to-top" href="javascript:void(0);" onclick="document.body.scrollTop = 0;document.documentElement.scrollTop = 0;">';
    content += '返回顶部';
    content += '</a>';
    // 把拼装好的内容放到侧边栏#content里面
    $('#sidebar').html(content);
    // console.log(content);
  } else {
    // 没有h1的情况，侧边栏不显示，给正文加偏移
    $('#sidebar-wrapper').css('display', 'none');
    $('#container-wrapper').attr('class', 'col-md-offset-1 col-md-9 col-md-offset-2');
  }
}

// 当hash路由改变或者页面加载时，请求markdown
window.onhashchange = ajaxMD;
window.onload = ajaxMD;

// 一开始就build顶部导航条
buildNavbar();