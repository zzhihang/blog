## js中创建对象的几种方式

### 工厂模式
 
	function createPig(weight, age){
		var p = {};
		p.weight = weight;
		p.age = age;
		p.sayWeight = function(){
			return this.weight;
		}
	}
	var person = createPig('zhu', 18);

优点：对象的封装，解决了创建相似对象的问题；
缺点：无法知道对象的类型，对象类型p始终继承自Object，原型链上只有Object.prototype。

### 构造函数模式

	
	function Pig(weight, age){
		this.weight = weight;
		this.age = age;
		this.sayWeight = function(){
			return this.weight;
		}
	}

	var pig = new Pig(100, 1);

优点：能够识别对象类型，pig来自于其构造函数Pig；
缺点：实例会复制每个sayHungry方法，函数也是对象，相当于同时又实例化了多个对象。

### 原型模式 [原型链及继承原理](https://github.com/zzhihang/blog/issues/1)

	function Pig(){
	
	}

	Pig.prototype.weight = '10';

	Pig.prototype.sayWeight = function(){
		return this.weight;
	}

优点： 个人觉得没什么优点，反而写的更麻烦了，因为属性也是同样被共享了；
缺点：一般很少有人这样用吧，构造函数初始化的时候传入一些参数更好，于是也就有了构造函数+原型链的方法模式

### 构造函数 + 原型链模式

	function Pig(weight, age){
		this.weight = weight;
		this.age = age;
	}

	Pig.prototype = {
		constructor: Pig;
		sayWeight: function(){
			return this.weight;
		}
	}

优点：灵活，共享属性和方法以及实例各自的属性都会被区分；

### 寄生构造函数模式
基本思想为创建一个函数，函数的作用仅仅只是将创建对象的代码封装起来，然后返回新创建的对象，表面看来，和第一种模式很像；
	function Person(weight, age){
		var pig = {};
		pig.weight = weight;
		pig.age = age;
		return pig;
	}

假设有这样一个问题，在不破坏Array本身构造函数的情况下，如何创建一个同样拥有Array方法并可以扩展？

    function MyArray(){
        var array = [];
        array.push.apply(array, arguments);
        array.splitByLine = function(){
            return this.join('|');
        }
        return array;		
    }
    var myArray = new MyArray('zhu', 'zhi')
    console.log(myArray.splitByLine());
