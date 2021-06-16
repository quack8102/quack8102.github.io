

# Problem B: A Sequence of Permutations - solution

注意到$f(p,q)=qp^{-1}$，我们列出$a_n$的前几项：

  

$$a_2 = q\\\a_3 = qp^{-1}\\\a_4 = qp^{-1}q^{-1}\\\a_5 =
qp^{-1}q^{-1}pq^{-1}\\\a_6 = qp^{-1}q^{-1}p^2q^{-1}\\\a_7 = qp^{-1}q^{-1} p
qpq^{-1}\\\a_8 = qp^{-1}q^{-1}p q p^{-1}qpq^{-1}\\\\\cdots$$

  
记$t=qp^{-1}q^{-1}p$，则$a_7=tpt^{-1},a_8=tqt^{-1}$。根据$f(tpt^{-1},tqt^{-1})=tqp^{-1}t^{-1}$，我们可以得到$a_{6k+1}
= t^kpt^{-k}, a_{6k+2} = t^kqt^{-k}$，因此搞个快速幂之后暴力算几项就完事了！!1  
  
  
  

