// 三个状态：PENDING、FULFILLED、REJECTED
//订阅发布模式 收集依赖 -> 触发通知 -> 取出依赖执行的方式，被广泛运用于发布订阅模式的实现。
// https://juejin.cn/post/6844903665686282253#heading-2
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

const isFunction = variable => typeof variable === 'function'

class Promise{
    constructor(executor){
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        let resolve = value => {
            if(this.status !== PENDING) return;
            const run = () => {
                const runFulfilled = (value) => {
                    let cb;
                    // 依次执行成功队列中的函数，并清空队列
                    while(cb = this.onResolvedCallbacks.shift()){
                        cb(value)
                    }
                }

                const runRejected = (error) => {
                    let cb;
                    while (cb = this.onRejectedCallbacks.shift()) {
                        cb(error)
                    }
                }

                if(value instanceof Promise){
                    value.then(value => {
                        this.value = value;
                        this.status = FULFILLED;
                        runFulfilled(value)
                    }, err => {
                        this.reason = err;
                        this.status = REJECTED;
                        runRejected(err)
                    })
                }else{
                    this.value = value;
                    this.status = FULFILLED;
                    runFulfilled(value)
                }
            }

            // 为了支持同步的Promise，这里采用异步调用
            setTimeout(run, 0)
        };

        let reject = reason => {
            if(this.status === PENDING){
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(cb => cb())
            }
        };

        try{
            executor(resolve, reject)
        }catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected){
        //解决 onFufilled，onRejected 没有传值的问题
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        //因为错误的值要让后面访问到，所以这里也要跑出个错误，不然会在之后 then 的 resolve 中捕获
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
        const {value, status, reason} = this;
        //then返回一个新的promise
        return new Promise((onFulfilledNext, onRejectedNext) => {
            let funfilled = value => {
                try{
                    if(!isFunction(onFulfilled)){
                        onFulfilledNext(value)
                    }else{
                        let res = onFulfilled(value);
                        if(res instanceof Promise){
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext)
                        }else{
                            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(res)
                        }
                    }
                }catch (e) {
                    // 如果函数执行出错，新的Promise对象的状态为失败
                    onRejectedNext(e)
                }
            };

            let rejected = err => {
                try{
                    if(!isFunction(onRejectedNext)){
                        onRejectedNext(err)
                    }else{
                        let res = onRejectedNext(err);
                        if(res instanceof Promise){
                            res.then(onFulfilledNext, onRejectedNext)
                        }else{
                            onRejectedNext(res)
                        }
                    }
                }catch (e) {
                    onRejectedNext(e)
                }
            };

            if(this.status === PENDING){
                this.onResolvedCallbacks.push(funfilled);
                this.onRejectedCallbacks.push(rejected);
            }
            if(this.status === FULFILLED){
                onFulfilled(value)
            }
            if(this.status === REJECTED){
                onRejected(reason)
            }
        })
    }
    catch(onRejected){
        return this.then(undefined, onRejected)
    }
    static resolve(value){
        if(value instanceof Promise) return value;
        return new Promise(resolve => resolve(value))
    }
    static reject(error){
        return new Promise((resolve, reject) => reject(error))
    }


    //Promise.all()方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，
    // 如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。
    // 另外，Promise.all()方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。
    static all(promises){
        return new Promise((resolve, reject) => {
            if(!Array.isArray(promises)){
                throw new TypeError('promises should be an array')
            }
            let result = [];
            let count = 0; //记录resolved的数量
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(res => {
                    result[index] = res;
                    count++;
                    if(count === promises.length){
                        resolve(result)
                    }
                }, err => {
                    reject(err);
                })
            })
        })
    }

    static race(promises){
        return new Promise((resolve, reject) => {
            for (let promise of promises){
                Promise.resolve(promise).then(res => {
                    resolve(res)
                }, error => {
                    reject(error)
                })
            }
        })
    }

    finally(cb){
        return this.then(
            value => Promise.resolve(cb()).then(() => value),
            error => Promise.resolve(cb()).then(() => { throw error })
        )
    }
}

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功');
    },1000);
}).then(
    (data) => {
        console.log('success', data)
    },
    (err) => {
        console.log('faild', err)
    }
)


