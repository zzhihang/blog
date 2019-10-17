
##### 只有function才有prototype属性 默认prototye对象身上只有一个constructor属性指向function
##### 任何对象都有__proto__(原型)属性,都会指向其构造函数的prototype

- 构造函数的__proto__
```
所有的构造函数都是Function的实例,包括Array, Function, Date, Object, Number内置构造函数

所以 
Array.__proto__ === Function.prototype
Object.__proto__ === Function.prototype
Function.__proto__ === Function.prototype

var a = function(){}

a.__proto__ === Function.prototype 因为a也是Function的实例

```
- 普通对象的__proto__

```
var a = new Object();
a._proto = Object.prototype
所有的普通对象的__proto__都等于Object.prototype,因为所有的普通对象都可以看做是由构造函数构造出来的对象
    
```
- 顶层Object.__proto__.prototype === null
```
原型链是向上搜索的，搜到最顶层没有的话就会返回undefined了
    
```

##### new的过程(new Object())
    
- 创建返回值 既然是得到对象 也就是创建一个对象作为new的返回实例，这里设为a
- 原型指向 对象肯定是要有__proto__原型的，所有原型都指向其构造函数的prototype,也就是进行了a.__proto__ = Object.prototype赋值操作;
- this指向处理 将this指向a，也就是指向构造函数的实例
- 执行构造函数内部代码

 经过上面步骤，生成的a就有了构造函数的属性和方法
 
 
 #### constructor
 
 既然每一个实例对象的原型都可以访问到其构造函数的prototype属性, 因为构造函数prototype本身就保存了自身constructor，constructor指向构造函数方便自己访问自己的构造函数方法
 
 因此
    
    实例.constructor === 构造函数.prototype.constructor 这是实例通过访问自己的__proto__属性从而访问到其构造函数的prototype 自然也就拿到了constructor
    
    
#### 简单的子类继承父类

```
function Base() {}

// Sub1 inherited from Base through prototype chain
function Sub1(){}
Sub1.prototype = new Base();
Sub1.prototype.constructor = Sub1;

Sub1.superclass = Base.prototype;

// Sub2 inherited from Sub1 through prototype chain
function Sub2(){}
Sub2.prototype = new Sub1();
Sub2.prototype.constructor = Sub2;

Sub2.superclass = Sub1.prototype;

// Test prototype chain
alert(Sub2.prototype.constructor);// function Sub2(){}
alert(Sub2.superclass.constructor);// function Sub1(){}
alert(Sub2.superclass.constructor.superclass.constructor);// function Base(){}

```

上面代码可以看出，一旦prototype整个对象发生重新赋值的话constructor属性就会发生变化

> function F() {}
    F.prototype = {
    _name: 'Eric',
    getName: function() {
    return this._name;
    }
};

初看这种方式并无问题，但是你会发现下面的情况：
```
var f = new F();
alert(f.constructor === F); // false 
f.constructor === Object // true
f.constructor === Object.prototype.constructor //true

```
这是因为F.prototype被完全重写了，导致实例f通过__proto__查找到的只是重新赋值的对象字面量{};
由于{}是Object的实例，{}.__proto__指向了Object.prototype，此时原型链向上查找，最终f.constructor === Object.prototype.constructor, 由于prototype.constructor指向自身，所以f.constructor === Object;

###### 恢复constructor指针的指向
只需要F.prorotype.constructor === F就行了
