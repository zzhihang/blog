const Observe = (function () {
    //防止消息队列暴露而被篡改，将消息容器设置为私有变量
    let __message = {};
    return {
        //注册消息接口
        on : function (type, fn) {
            if(!__message[type]){
                __message[type] = [fn]
            }else{
                __message[type].push(fn);
            }
        },
        //发布消息接口
        subscribe : function (type, args) {
            if(!__message[type]) return;
            let events = {
                    type: type,           //消息类型
                    args: args || {}       //参数
                };
            for(let i = 0; i < __message[type].length; i++){
                __message[type][i].call(this, events);
            }
        },
        //移除消息接口
        off : function (type, fn) {
            if(__message[type] instanceof Array){
                for(let i = 0; i < __message[type].length; i++){
                    if(__message[type][i]){
                        __message[type].splice(i, 1);
                    }
                }
            }
        }
    }
})();


Observe.on('say', function (data) {
    console.log(data.args.text);
})

Observe.subscribe('say', { text : 'hello world' } )
