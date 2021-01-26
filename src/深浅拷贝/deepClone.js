function deepClone(source) {
    const targetObj = source.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] && typeof source[key] === 'object') {
                targetObj[key] = source[key].constructor === Array ? [] : {};
                targetObj[key] = deepClone(source[key])
            } else {
                targetObj[key] = source[key]
            }
        }
    }
    return targetObj
}


const originObj = {
    name: 'axuebin',
    sayHello: function () {
        console.log('Hello World');
    }
}

const cloneObj = deepClone(originObj);
console.log(cloneObj)
