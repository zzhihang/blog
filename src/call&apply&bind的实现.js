var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value)
    console.log(name)
    console.log(age)
    return {
        name: name
    };
}


//bar.call(foo)


Function.prototype.myCall = function (context) {
    context = context || window; //传入null的时候指向window
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i + ']') //使用字符串的原因是防止eval('context.fn(zhuzhihang, 18)'),会报zhuzhihang is not defined
    }
    //es6在此处就很简单了
    // args = [...arguments].slice(1);
    // context.fn(...args)
    console.log(args) //[ 'arguments[1]', 'arguments[2]' ],这样在执行eval时,arguments[1]是作为一个真实变量存在的，
    context.fn = this;
    var result = eval('context.fn(' + args + ')');
    delete context.fn;
    return result;
};

var result = bar.myCall(foo, 'zhuzhihang', '18')
console.log(result)


Function.prototype.myBind = function (context){
    const self = this;
    const args = Array.prototype.slice.call(arguments, 1);
    const structure = function (){
        const _args = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof structure ? this : context, args.concat(_args)) //一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。
    }
    structure.prototype = this.prototype;
    return structure;
}
