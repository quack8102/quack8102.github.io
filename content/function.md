# 功能
MDoc是一个文档系统，其主要功能是把markdown文件在线渲染成html，并且把各个分散的markdown组织起来。这样，我们就可以编写markdown文件，再用浏览器进行浏览。MDoc还能为markdown文件生成目录以方便浏览。

此外，MDoc还有代码高亮和公式渲染功能，方便进行更好的浏览。

## 目录结构

    ./ 根目录
    ./index.html 主页面，所有的md文件都是在此页面上动态生成html
    ./static 静态文件，主要是一些css和js
    ./static/css/mdoc.css MDoc的样式表
    ./static/js/mdoc.js MDoc的js
    ./content 存放markdown文件的文件夹
    ./content/index.md 默认显示此md
    ./content/navigation.md 根据此md生成网页顶部导航条的内容
    ./content/404.md 找不到对应的md时，显示此md

## 路由和相对路径
MDoc的路由规则非常简单。假设MDoc架设的网址是`xxx/index.html`，那么`xxx/index.html#!a.md`将会加载`./content/a.md`。同理，`xxx/index.html#!dir/b.md`将会加载`./content/dir/b.md`。

MDoc的相对路径解析也是合理的。假设有图片`img.jpg`位于`./content/dir/img.jpg`。`./content/dir/b.md`想要引用此文件，由于它们位于同一个目录，应该写：

    ![img](img.jpg)

MDoc将会根据`./content/dir/b.md`的路径推断出`img.jpg`的路径，翻译成html的结果是：

    <img src="content/dir/img.jpg" alt>

MDoc的相对路径解析支持的情况除了图片文件之外，还有超链接中的md文件和pdf文件。

## 代码高亮
MDoc具有代码高亮功能。一段php语法高亮的例子:

    ```php
    <?php
        $a = true;
        if($a){
            echo 'hello world';
        }
    ?>
    ```

render:

```php
<?php
    $a = true;
    if($a){
        echo 'hello world';
    }
?>
```

支持语言列表如下:

|Language       |Keyword      |
|---------------|-------------|
|Bash           |bash         |
|C#             |csharp       |
|Clojure        |clojure      |
|C++            |cpp          |
|CSS            |css          |
|CoffeeScript   |coffeescript |
|CMake          |cmake        |
|HTML           |html         |
|HTTP           |http         |
|Java           |java         |
|JavaScript     |javascript   |
|JSON           |json         |
|Markdown       |markdown     |
|Objective C    |objectivec   |
|Perl           |perl         |
|PHP            |php          |
|Python         |python       |
|Ruby           |ruby         |
|R              |r            |
|SQL            |sql          |
|Scala          |scala        |
|Vala           |vala         |
|XML            |xml          |

## 公式
MDoc具有公式渲染功能。

    $$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$
    
    $$ \frac{\partial \phi}{\partial x} \vert_b = \frac{1}{\Delta x/2}(\phi_0-\phi_b) $$

    $$ \int u \frac{dv}{dx}\,dx=uv-\int
    \frac{du}{dx}v\,dx\lim_{n\rightarrow \infty }
    \left (  1 +\frac{1}{n} \right )^n
    $$

$$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

$$ \frac{\partial \phi}{\partial x} \vert_b = \frac{1}{\Delta x/2}(\phi_0-\phi_b) $$

$$ \int u \frac{dv}{dx}\,dx=uv-\int
\frac{du}{dx}v\,dx\lim_{n\rightarrow \infty }
\left (  1 +\frac{1}{n} \right )^n
$$

> End enjoy!