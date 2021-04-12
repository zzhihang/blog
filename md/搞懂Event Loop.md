## Event Loop中的宏队列和微队列 

**宏队列，macrotask，也叫tasks。** 一些异步任务的回调会依次进入macro task queue，等待后续被调用，这些异步任务包括：

- setTimeout
- setInterval
-  setImmediate (Node独有)
-  requestAnimationFrame (浏览器独有)
- I/O
- UI rendering (浏览器独有)

**微队列，microtask，也叫jobs。** 另一些异步任务的回调会依次进入micro task queue，等待后续被调用，这些异步任务包括：

- process.nextTick (Node独有)
-  Promise
-  Object.observe
-  MutationObserver

![avatar](https://user-gold-cdn.xitu.io/2018/9/5/165a8667bb6e623e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## JavaScript代码的具体流程

1. 执行全局Script同步代码，这些同步代码有一些是同步语句，有一些是异步语句（比如setTimeout等）；
2. 全局Script代码执行完毕后，调用栈Stack会清空；
3. 从微队列microtask queue中取出位于队首的回调任务，放入调用栈Stack中执行，执行完后microtask queue长度减1；
4. 继续取出位于队首的任务，放入调用栈Stack中执行，以此类推，直到直到把microtask queue中的所有任务都执行完毕。**注意，如果在执行microtask的过程中，又产生了microtask，那么会加入到队列的末尾，也会在这个周期被调用执行**；
5. microtask queue中的所有任务都执行完毕，此时microtask queue为空队列，调用栈Stack也为空；
6. 取出宏队列macrotask queue中位于队首的任务，放入Stack中执行；
7. 执行完毕后，调用栈Stack为空；
8. 重复第3-7个步骤；
9. 重复第3-7个步骤；

这里归纳3个重点：

1. 宏队列macrotask一次只从队列中取一个任务执行，执行完后就去执行微任务队列中的任务；
2. 微任务队列中所有的任务都会被依次取出来执行，直到microtask queue为空；
3. 图中没有画UI rendering的节点，因为这个是由浏览器自行判断决定的，但是只要执行UI rendering，它的节点是在执行完所有的microtask之后，下一个macrotask之前，紧跟着执行UI render。


## 实战


#### Q1
    
    console.log(1); //同步代码被执行 1
    
    setTimeout(() => {
      console.log(2); //进入宏队列
      Promise.resolve().then(() => {
        console.log(3) //进入微队列
      });
    });
    
    new Promise((resolve, reject) => {
      console.log(4) //new Prosmise的时候会执行此处
      resolve(5) 
    }).then((data) => { //进入微队列
      console.log(data);
    })
    
    setTimeout(() => {//进入宏队列
      console.log(6);
    })
    
    console.log(7); //同步代码被执行 7
    
   
#### A1 
    // 正确答案
    1
    4
    7
    5
    2
    3
    6
    
    
#### Q2
    console.log(1);  //1
    
    setTimeout(() => {
      console.log(2);
      Promise.resolve().then(() => { //注意此处then之后的回调作为微任务被添加到队列的末尾，需要将此处的微任务执行完毕才能执行下一个宏任务队列中的第一项； 
      //谨记这句话 在执行微队列microtask queue中任务的时候，如果又产生了microtask，那么会继续添加到队列的末尾，也会在这个周期执行，直到microtask queue为空停止。
        console.log(3)
      });
    });
    
    new Promise((resolve, reject) => {
      console.log(4) //new Prosmise的时候会执行此处 4
      resolve(5)
    }).then((data) => {
      console.log(data);
      
      Promise.resolve().then(() => {
        console.log(6)
      }).then(() => {
        console.log(7)
        
        setTimeout(() => {
          console.log(8)
        }, 0);
      });
    })
    
    setTimeout(() => {
      console.log(9);
    })
    
    console.log(10);

#### A2
    // 正确答案
    1
    4
    10
    5
    6
    7
    2
    3
    9
    8
    
    
内容大部分学习自 [带你彻底弄懂Event Loop](https://juejin.im/post/5b8f76675188255c7c653811)
