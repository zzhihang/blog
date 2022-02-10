function debounce(func, wait, immediate){
    let timer;
    return function (){
        const context = this;
        const args = arguments;
        timer && clearInterval(timer)
        if(immediate && !timer){//需要立即执行
            func.apply(context, args)
        }
        timer = setTimeout(function (){
            func.apply(context, args)
        }, wait);
    }
}

https://www.jinkela.site/link/TufMJDdiYYPghvu4?sub=3