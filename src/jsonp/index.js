function jsonp(url, data, callback){
    var callbackName = "callback_" + new Date().getTime();
    window[callbackName] = callback;
    data.callback = callbackName;
    var params = [];
    for (var key in data){
        params.push(key + '=' + data[key])
    }

    var script = document.createElement('script');
    script.src = url + '?' + params.join('&');

    window[callbackName] = function (param) {//将传入的callback封装在内部并挂载在window身上
        callback(param);
        document.body.removeChild(script);
    };

    document.body.appendChild(script);
}


//返回promise
function jsonp2(url, data, callback){
    var callbackName = "callback_" + new Date().getTime();
    window[callbackName] = callback;
    data.callback = callbackName;
    var params = [];
    for (var key in data){
        params.push(key + '=' + data[key])
    }

    var script = document.createElement('script');
    script.src = url + '?' + params.join('&');
    document.body.appendChild(script);

    return new Promise(function (resolve, reject) {
        window[callbackName] = function (param) {
            try {
                resolve(param);
                callback(param);
            }catch (e) {
                reject(param)
            }finally {
                document.body.removeChild(script);
            }
        };
    });
}



jsonp2('https://photo.sina.cn/aj/index',{
    page:1,
    cate:'recommend',
},function(data){
    console.log(data)
}).then(function (data) {
    console.log(data)
})
