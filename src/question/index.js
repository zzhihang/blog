//红绿灯问题 红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用 Promise 实现）
function red(){
    console.log('red');
}
function green(){
    console.log('green');
}
function yellow(){
    console.log('yellow');
}

function light(timer, cb) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            cb();
            resolve()
        }, timer)
    })
}

function step() {
    Promise.resolve().then(function () {
        return light(3000, red)
    }).then(function () {
        return light(1000, green)
    }).then(function () {
        return light(2000, yellow)
    }).then(function () {
        step()
    })
}

step();

//用js实现二分查找位置：二分查找的前提是有序数组

var arr = [1,2,4,6,8,9,11,34,67];

function search(target, array){
    var start = 0, end = array.length - 1;
    while (start <= end){
        var mid = parseInt((start + end) / 2);
        if(target === array[mid]){
            return mid;
        }else if(target < array[mid]){
            end = mid - 1;
        }else if(target > array[mid]){
            start = mid + 1;
        }else{
            return -1;
        }
    }
}
console.log(search(11, arr));

//递归实现
function search2(target, array, start, end) {
    start = start || 0;
    end = end || array.length - 1;
    var mid = parseInt((start + end) / 2);
    if(target === array[mid]){
        return mid;
    }else if(target < array[mid]){
        end = mid - 1;
        return search2(target, array, start, end);
    }else if(target > array[mid]){
        start = mid + 1;
        return search2(target, array, start, end);
    }else{
        return -1;
    }
}

console.log(search2(34, arr))


//斐波那契数列：1、1、2、3、5、8、13、21。输入n，输出数列中第n位数的值。
function f(n) {
    if(n <= 2){
        return 1
    }else{
        return f(n - 1) + f(n - 2)
    }
}

console.log(f(12))


function f1(n) {
    const cache = {};
    function _fn() {
        if(cache[n]){
            return cache[n]
        }
        if(n <= 2){
            return 1;
        }
        const prev = _fn(n - 1);
        cache[n - 1] = prev;
        const next = _fn(n - 2);
        cache[n - 2] = next
        return prev + next;
    }
    return _fn(n);
}

console.log(f(128))
