// 定义Promise的三种状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

const isFunction = variable => typeof variable === 'function'

class MyPromise{
    constructor(handle) {
        this.status = PENDING;
        this.value = '';
        this.fullfilledQueues = [];
        this.rejetedQueues = [];
        try{
            handle(this._resolve.bind(this), this._reject.bind(this));
        }catch (e){
            this._reject(e);
        }
    }
    _resolve(val){
        if(this.status !== PENDING) return;
        const run = () => {
            const runFullfilled = (value) => {
                let cb;
                while (cb = this.fullfilledQueues.shift()){
                    cb(val)
                }
            }

            const runRejected = (error) => {
                let cb;
                while (cb = this.rejetedQueues.shift()){
                    cb(error)
                }
            }

            if(val instanceof MyPromise){
                val.then(value => {
                    this.value = value;
                    this.status = FULFILLED;
                    runFullfilled(value)
                }, error => {
                    this.value = error;
                    this.status = REJECTED;
                    runRejected(error)
                })
            }else{
                this.value = val;
                this.status = PENDING;
                runFullfilled(val)
            }
        }
        run();
    }
    _reject(error){
        if(this.status !== PENDING) return;
        const run = () => {
            this.status = REJECTED
            this.value = error;
            let cb;
            while (cb = this.rejetedQueues.shift()){
                cb(error)
            }
        }
        run();
    }
    then(onFulfilled, onRejected){
        const {value, status} = this;
        switch (status){
            case PENDING:
                this.fullfilledQueues.push(onFulfilled);
                this.rejetedQueues.push(onRejected);
                break
            case FULFILLED:
                onFulfilled(value)
                break
            case REJECTED:
                onRejected(value);
                break
        }
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            let fullFilled = value => {
                try{
                    if(isFunction(onFulfilled)){
                        onFulfilledNext(value)
                    }else{
                        let res = onFulfilled(value);
                        if(res instanceof MyPromise){
                            res.then(onFulfilledNext, onRejectedNext)
                        }else{
                            onFulfilledNext(res);
                        }
                    }
                }catch (e){
                    onRejectedNext(e)
                }
            }

            let rejected = error => {
                try{
                    if(isFunction(onRejected)){
                        onRejectedNext(error)
                    }else{
                        let res = onRejected(value);
                        if(res instanceof MyPromise){
                            res.then(onFulfilledNext, onRejectedNext)
                        }else{
                            onRejectedNext(error);
                        }
                    }
                }catch (e){
                    onRejectedNext(e)
                }
            }

            switch (status){
                case PENDING:
                    this.fullfilledQueues.push(fullFilled);
                    this.rejetedQueues.push(rejected)
                    break;
                case FULFILLED:
                    fullFilled(value);
                    break;
                case REJECTED:
                    rejected(value);
                    break;
            }
        })
    }


}

new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('FULFILLED')
    }, 1000)
})