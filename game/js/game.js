function Game(obj){
	this.box = document.getElementById(obj);
	this.div1 = document.getElementById('div');
	this.Index = document.getElementById('index');//首页选模式界面
	this.IndexLis = this.Index.getElementsByTagName('li'); 
	this.list = document.getElementById('list');//外层.游戏区域
	this.lis = this.list.getElementsByTagName('li');//一排  
	this.datS = document.getElementById('datS');//秒，游戏中
	this.progressBar = document.getElementById('progressBar');//游戏进度条
	this.show = document.getElementById('show');//显示层（得分状态）
	this.texta = show.children[0];//文字提示
	this.nowDate = show.getElementsByClassName('date')[0];//显示层的时间
	this.best = show.getElementsByClassName('best')[0].children[0];//历史最佳时间
	this.over = document.getElementById('over');//结束按钮
	this.nextContinue = document.getElementById('nextContinue');//继续玩按钮
	this.audio = document.getElementsByTagName('audio')[0]; 
	this.jjMode = document.getElementById('jj_mode');//街机模式中的
	this.jjModeLi = this.jjMode.getElementsByTagName('li');//街机模式中的几种效果li
	this.jjWy = document.getElementById('jj_wy');//乌云效果
	this.keyclick = document.getElementById('keyclick')//点击设置按钮 
	this.music = document.getElementsByClassName('music')[0];
	this.key1 = document.getElementById('key');//游戏下方按键
	this.keyLis = this.key1.getElementsByTagName('li');//游戏下方按键li集合 
	this.keyset = document.getElementById('keyset');//按键设置框 
	this.keySetInput = this.keyset.getElementsByClassName('keyright');//设置中的游戏按键
	this.btn = document.getElementById('btn').children;//按键设置中的确定/取消按钮
	this.n = parseFloat(this.getStyle(this.list,'top')); 
	this.s = 1000;
	this.x = 500;
	this.beginOnOff = false;  //游戏总开关
	this.timer = null;  
	this.keyArr = [65,83,75,76];//按键
	this.keyArr1 = [];//按键复制
	this.musicbtn = '开';//声音开关
	this.musicbtn1 = '';
	this.jsonKey = {
		81:'Q',87:'W',69:'E',82:'R',84:'T',89:'Y',85:'U',73:'I',79:'O',80:'P',
		65:'A',83:'S',68:'D',70:'F',71:'G',72:'H',74:'J',75:'K',76:'L',
		90:'Z',88:'X',67:'C',86:'V',66:'B',78:'N',77:'M'
	}  
	this.blackArr = [];//存放需要按下的黑块
	this.bestArr = { jd:[], jj:[], c:[], js:[] };//存放历史最佳时间 
	this.mode = null;//存放模式
	this.ss = 0; //记录按下的个数。街机和禅模式需要用到； 
	this.timer = null;
	this.A1 = null;//存放当前按下的块、对象 经典模式
	this.divLength = 0;//块的个数，经典模式块走到20.计算进度条长度
}
Game.prototype = {
	constructor:Game,
	init:function(){
		document.onmousedown = function(){
			return false;
		}
		this.ready(); //进入游戏
		this.overGame();//结束，回到首页面
		this.continueGame();//继续玩 
		this.keySeta();//默认的游戏按键 
		this.keyClickFn();//设置游戏按键按钮点击
		this.setKey()//设置游戏的按键
		this.btnFn1()//设置中确定按钮
		this.btnFn2()//设置中取消按钮
		this.musicBtnClick();
	},
	ready:function(){//点击模式进入游戏
		var _this = this;
		for (var i=0;i<this.IndexLis.length;i++) {
			this.IndexLis[i].onOffLi = true;
			this.IndexLis[i].index = i;
			this.IndexLis[i].onclick = function(){ 
				if(this.onOffLi){
					_this.mode = this.index;
					for (var i=0;i<_this.IndexLis.length;i++) {
						_this.IndexLis[i].onOffLi = false; 
					}
					this.blackArr = [];  
					move(_this.Index,{left:320},1000,'backIn')
					move(_this.keyclick,{left:612},1000,'backIn')
					move(_this.list,{left:0},1000,'backIn',function(){
						if(_this.mode ==2||_this.mode ==0){
						_this.progressBar.style.display = 'block';//禅模式的进度条显示
							if(_this.mode ==0){
								_this.progressBar.style.width = 0;
							}
						}
						
					})
					move(_this.key1,{opacity:1},1500,'backIn',function(){
						_this.key1.style.display = 'block';
					})
					if(_this.mode ==0||_this.mode ==2||_this.mode ==3){
						if(_this.mode ==2){
							_this.datS.innerHTML = '00';
						}
						move(_this.datS,{top:15},1000,'backIn')
					}else if(_this.mode ==1){
						move(_this.jjMode,{opacity:1},1000,'backIn'); 
						_this.jjMode.style.display = 'block';
						//街机模式中的效果
						for(var i=0;i<_this.jjModeLi.length;i++){
							_this.jjModeLi[i].onclick = function(){
								for(var i=0;i<_this.jjModeLi.length;i++){
									_this.jjModeLi[i].className = '';
								}
								this.className = 'red'; 
							}
						}
					}
					_this.beginOnOff = true;//进入游戏开关为真
					_this.randomLiDiv(); //黑块随机执行 
					_this.begin();//开始游戏
				} 
			}
		}
	},
	begin:function(){//开始游戏
		var _this = this;
		_this.A1 = null;
		this.divLength = 0;//块的个数，经典模式块走到20.计算进度条长度
		this.A1 = null;//存放当前按下的块、对象  
		this.n = parseFloat(this.getStyle(this.list,'top'));
		//键盘按下事件、
		if(this.beginOnOff){  
			window.top.document.onkeydown = function(ev){
				var ev = ev||event;  
				for (var i = 0;i<_this.keyArr.length;i++) {
					if(ev.keyCode == _this.keyArr[i]){ 
						if(_this.blackArr[0] && ev.keyCode == _this.blackArr[0].index){ 
							//按对的颜色变为白  
							_this.blackArr[0].className = 'item';
							_this.blackArr.shift(_this.blackArr[0]); 
							_this.musicPlay(i);//音乐
							switch(_this.mode){
								case 0:  
									_this.mode0(ev);
									break;
								case 1:
									_this.mode1(ev);
									break;
								case 2:
									_this.mode2(ev);
									break;
								case 3:
									_this.mode3(ev);
									break;
							}	
						}else if(_this.blackArr[0] && _this.blackArr[0].innerHTML != '开始'){
							_this.keyError();//检测按错键 
						}  
					}
				}
			}
		}
	},
	mode0:function(ev){//模式0经典 
		var _this = this;    
		this.divLength++;
		this.progressBar.style.width = this.divLength*16+'px';//游戏进度条 
		if(this.divLength <20){  
			move(this.list,{top:0},50,'linear',function(){ 
				_this.list.removeChild(_this.lis[_this.lis.length-1]); 
				var li = document.createElement('li');  
				for (var i = 0; i<_this.lis.length;i++) {
					var div = document.createElement('div');
					if(_this.divLength == 16||_this.divLength == 17||_this.divLength == 18){  
						div.style.background = '#6ae4f2';
							if(i==1 && _this.divLength == 16){
									div.innerHTML = '终';
									div.style.textIndent = '40px';
							}else if(i==2 && _this.divLength == 16){
									div.innerHTML = '点';
									div.style.textIndent = '-40px';
							}
					}else{
						div.className = 'item';
					} 
					li.appendChild(div);
				} 
				_this.list.insertBefore(li,_this.list.children[0])
				_this.randomObj(li);   
				_this.list.style.top = '-125px';  
			})   
			//开始    || 时间 
			clearInterval(this.timer);  
			this.timer = setInterval(function(){  
				_this.s++; 
				var t = Math.round((_this.s-1000)*0.014*1000);  
				_this.datS.innerHTML = _this.addZero(t);
				_this.nowDate.innerHTML = _this.addZero(t);   
			},14)   
		}else{   
			this.A1 = this.blackArr[1];
			this.blackArr[0].className = 'item';
			this.blackArr.shift(this.blackArr[0]);
			clearInterval(this.timer); 
			this.blackArr =[]; 
			this.texta.innerHTML = '人若无梦想，同咸鱼何异！';
			this.nowDate.innerHTML = this.datS.innerHTML;
			this.showBlockNone();
			this.divLength = 0;
		}   
	},
	mode1:function(){
		var _this = this;
		move(_this.jjMode,{opacity:0},200,'backIn',function(){
			_this.jjMode.style.display = 'none'; 
			move(_this.datS,{top:15},200,'backIn')
		});  
		//街机中的几种效果  
		if(this.jjModeLi[0].className == 'red'){//乌云效果
			this.jjWy.style.display = 'block';  
			this.jjwyBlockNone(); 
		}else if(this.jjModeLi[1].className == 'red'){//震动效果
			shake(this.list,'left') 
		}else if(this.jjModeLi[2].className == 'red'){//变速效果
		 	var bbb = Math.round(Math.random()*100) 
			if (bbb<40) {
				this.x=150; 
			} else if (bbb>=40&&bbb<80) {
				this.x=400; 
			}else if(bbb>=80){
				this.x=700; 
			}
		}
		//匀速效果判断函数在定时器里边
		this.ss++;//点对的块数   
		clearInterval(this.timer); 
		this.timer = setInterval(function(){  
			_this.s++;//时间 
			_this.x-=0.14;  
			_this.datS.innerHTML = _this.addZeroSs(_this.ss);
			_this.nowDate.innerHTML = _this.addZeroSs(_this.ss);  
			if(_this.jjModeLi[3].className == 'red'){//匀速效果找自信
				_this.s=1000;
				_this.x=250;
			}
			_this.n = _this.n+_this.s/_this.x; 
			_this.autoListMode();//自动下落时检测
		},14) 
	},
	mode2:function(){
		var _this = this;
		this.ss++; 
		this.datS.innerHTML = this.addZeroSs(this.ss); 
		this.nowDate.innerHTML = this.addZeroSs(this.ss); 
		move(this.list,{top:0},15,'linear',function(){  
			_this.list.removeChild(_this.lis[_this.lis.length-1]);
			var li = document.createElement('li');  
			for (var i = 0; i<_this.lis.length;i++) {
				var div = document.createElement('div');
				div.className = 'item';
				li.appendChild(div);
			} 
			_this.list.insertBefore(li,_this.list.children[0])
			_this.randomObj(li);	
			_this.list.style.top = '-125px';
		})    
		clearInterval(this.timer);  
		this.timer = setInterval(function(){  
			_this.progressBar.style.width = (_this.x-180)+'px';
			_this.x-=0.34; 
			if( _this.x-180<=0.1 ){
				clearInterval(_this.timer)
				_this.showBlockNone();
			}
		},14)   
	},
	mode3:function(){
		var _this = this;   
		clearInterval(this.timer); 
		this.timer = setInterval(function(){  
			_this.s++;
			_this.x-=0.14
			var t = Math.round((_this.s-1000)*0.014*1000); 
			_this.datS.innerHTML = _this.addZero(t);
			_this.nowDate.innerHTML = _this.addZero(t); 
			_this.n = _this.n + _this.s / _this.x; 
			_this.autoListMode();//自动下落时检测  
		},14)  
	}, 
	autoListMode:function(){//自动下落时检测  
		var _this = this;  
		if(_this.n>=0){
			//有没有黑色没按
			if(this.blackArr[0] && this.blackArr[0].offsetTop == this.div1.offsetHeight-1){
				this.musicPlay('over');
				this.beginOnOff = false;
				clearInterval(this.timer); 
				this.blackArr[0].style.background = 'red';
				move(this.list,{top:-125},200,'easeIn',function(){
					_this.showBlockNone();
				});
				return;
			}else{ 
				this.list.removeChild(this.lis[this.lis.length-1]); 
				var li = document.createElement('li');  
				for (var i = 0; i<this.lis.length;i++) {
					var div = document.createElement('div');
					div.className = 'item';
					li.appendChild(div);
				} 
				this.list.insertBefore(li,this.list.children[0])
				this.randomObj(li);	
			} 
			this.n = -125;
		}
		this.list.style.top = this.n+'px'; 
	},
	keyError:function(){ //检测按错键 
		this.musicPlay('over');
		clearInterval(this.timer); 
		this.blackArr[0].style.background = 'red';  
		this.blackArr =[]; 
		this.texta.innerHTML = '人若无梦想，同咸鱼何异！';
		if(this.mode ==0){
			this.nowDate.innerHTML = '败了';
		} 
		this.showBlockNone();
		this.divLength = 0; 
	},
	randomLiDiv:function(){//初始黑块随机  
		for (var i = this.lis.length-1;i>=0;i--) {  
			this.randomObj(this.lis[i])//随机黑块
			//最后一排加开始字符
			if(i == this.lis.length-1){
				var divIt = this.lis[i].getElementsByTagName('div');
				for (var j = 0; j<divIt.length; j++) {
					if(divIt[j].className == 'it'){
						divIt[j].innerHTML = '开始';  
					}
				}
			}
		} 
	},
	overGame:function(){//点击结束按钮，回到游戏首页
		var _this = this;
		this.over.onclick = function(){
			_this.showBlockNone(); 
			_this.keyclick.style.left = '-28px'; 
			_this.Index.style.left = '-320px'; 
			move(_this.list,{left:320},800,'easeIn',function(){
				//当首页全部展现的时候，可以点击模式，为true；
				for (var i=0;i<_this.IndexLis.length;i++) {
					_this.IndexLis[i].onOffLi = true; 
				}
			})
			move(_this.datS,{top:-40},800,'easeIn')
			_this.beginOnOff = false;//返回首页开关为假
			move(_this.keyclick,{left:292},800,'easeIn')
			move(_this.Index,{left:0},800,'easeIn',function(){
				_this.removeStyle();
				_this.list.style.top = '-125px';
				_this.datS.innerHTML = '0.000/s';
			})
			_this.s = 1000;
			_this.x = 500;
			_this.ss = 0; 
			//点击结束，分度条关闭，初始化
			_this.progressBar.style.width = 320+'px';
			_this.progressBar.style.display = 'none';
			move(_this.key1,{opacity:0},1500,'backIn',function(){
				_this.key1.style.display = 'none'; 
				_this.keyclick.style.display = 'block';
			}) 
		}
	}, 
	continueGame:function(){//点击继续玩按钮，重新载入游戏
		var _this = this;
		this.nextContinue.onclick = function(){ 
			_this.blackArr = [];
			_this.removeStyle();
			_this.showBlockNone();
			_this.randomLiDiv();
			_this.beginOnOff = true;
			_this.list.style.top = '-125px';
			if(_this.mode ==0||_this.mode ==3){//经典模式、极速模式
				_this.datS.innerHTML = '0.000/s';
				_this.progressBar.style.width = 0+'px';
			}else if(_this.mode ==2){//禅模式
				_this.datS.innerHTML = '00';
				_this.progressBar.style.width = 320+'px'; 
			}else if(_this.mode ==1){//街机模式
				_this.datS.innerHTML = '00';
			} 
			_this.s = 1000;
			_this.x = 500;
			_this.ss = 0;
			_this.n = parseFloat(_this.getStyle(_this.list,'top'));
			//点击重玩，分度条初始化 
		}
	}, 
	randomObj:function(obj) {//随机黑块
//		console.log(this.blackArr)
		var divs = obj.getElementsByTagName('div');
		var randomX = Math.random()*100;
		var x = Math.floor( Math.random()*divs.length) ; 
		divs[x].className = 'it'; 
		divs[x].index = this.keyArr[x]//自定义属性、键值
		this.blackArr.push(divs[x])//把对象存入blackArr；  
	}, 
	showBlockNone:function (){//显示层显示函数/隐藏函数
		if(this.show.style.display == 'block'){ 
			this.show.style.display = 'none'; 
			this.beginOnOff = true; 
			move(this.show,{opacity: 0},1000,'easeIn')  
		}else{
			this.show.style.display = 'block';
			this.jjWy.style.display = 'none';//乌云关闭
			this.jjWy.style.top = '-100px'; 
			this.beginOnOff = false;
			move(this.show,{opacity: 1},1000,'easeIn');
			//显示层显示时，把得分加入数组   
			if(this.mode == 0 && this.A1!=null){//0经典-最佳得分，只包括成功的、 
				this.bestArr.jd.push( parseFloat( this.nowDate.innerHTML ) ) ; 
				this.bestArr.jd.sort(function(a,b){
					return a-b;
				})  
				return this.best.innerHTML = this.bestArr.jd[0] +'/s';
			}else if(this.mode == 0 && this.bestArr.jd.length>0){ //
				return this.best.innerHTML = this.bestArr.jd[0] +'/s'; 
			}else if(this.mode == 0 && this.bestArr.jd.length==0){ //
				return this.best.innerHTML = '0.000/s'; 
			}
			//街机最佳得分的函数
			if(this.mode == 1){ 
				this.bestArr.jj.push( parseFloat( this.nowDate.innerHTML ) ) ; 
				this.bestArr.jj.sort(function(a,b){
					return b-a;
				}) 
				return this.best.innerHTML = this.addZeroSs(this.bestArr.jj[0]);
			} 
			//禅模式最佳得分的函数
			if(this.mode == 2){
				this.bestArr.c.push( parseFloat( this.nowDate.innerHTML ) ) ; 
				this.bestArr.c.sort(function(a,b){
					return b-a;
				})
				return this.best.innerHTML = this.addZeroSs(this.bestArr.c[0]) ;
			}
			//极速最佳得分的函数
			if(this.mode == 3){
				this.bestArr.js.push( parseFloat( this.nowDate.innerHTML ) ) ;
				this.bestArr.js.sort(function(a,b){
					return b-a;
				})
				return this.best.innerHTML = this.bestArr.js[0] +'/s';
			}  
		}  
	}, 
	removeStyle:function() {//清除块的样式
		var divs = this.list.getElementsByTagName('div');
		for (var i=0;i<divs.length;i++) {
			divs[i].className = 'item';
			divs[i].style.cssText = '';
			divs[i].innerHTML = '';
		}
	},  
	jjwyBlockNone:function (){ //街机中乌云效果  
		if(this.jjWy.offsetTop == '-100'){   
			move(this.jjWy,{top:250},2000,'easeIn')
		}else if(this.jjWy.offsetTop == 250){ 
			move(this.jjWy,{top:-100},500,'linear')
		} 
	},
	keySeta:function (){//默认的游戏按键 
		for (var i=0;i<this.keySetInput.length;i++) {
			if(this.jsonKey[this.keyArr[i]]){
				this.keySetInput[i].innerHTML = this.jsonKey[this.keyArr[i]];
			} 
		}  
	}, 
	keyClickFn:function(){//设置游戏按键的按钮点击
		var _this = this; 
		this.keyclick.onclick = function(){ 
			_this.keyset.style.display = 'block'; 
			for (var i=0; i<_this.keyArr.length; i++) {
				_this.keyArr1[i] = _this.keyArr[i]
			}
			for (var i=0;i<_this.IndexLis.length;i++) {//模式点击开关为假
				_this.IndexLis[i].onOffLi = false;
			}  
			this.style.display = 'none';
		}
	}, 
	setKey:function(){//设置按键
		var _this = this;
		var everyKey = null; //点击的是第几个按键，存一下
		for (var i=0;i<_this.keySetInput.length;i++) {
			_this.keySetInput[i].index1 = i;
			_this.keySetInput[i].onclick = function(){ 
				everyKey = this.index1;   
				window.top.document.onkeydown = function(ev){  
					var ev = ev||event;  
					if(_this.jsonKey[ev.keyCode]){//如果是26个字母中的 
						if(_this.keyArr1.indexOf(ev.keyCode) != -1){ 
							_this.keySetInput[_this.keyArr1.indexOf(ev.keyCode)].innerHTML = ' '; 
							_this.keyArr1[_this.keyArr1.indexOf(ev.keyCode)] = null;
						}  
						_this.keySetInput[everyKey].innerHTML = _this.jsonKey[ev.keyCode]; 
						_this.keyArr1[everyKey] = ev.keyCode; 
					}else{
						alert('请设置26个英文字母为游戏按键哦！！！')
						return;
					} 
				} 
			}
		}
	},
	btnFn1:function(){//设置中确定按钮
		var _this = this;
		this.btn[0].onclick = function(){
			for (var i=0;i<_this.keyArr1.length;i++) {
				if(_this.keyArr1[i] == null){ 
					return alert('游戏按键不能为空');
				}else{
					_this.keyArr[i] = _this.keyArr1[i];
					_this.keyLis[i].innerHTML = _this.keySetInput[i].innerHTML;
					_this.keyset.style.display = 'none'; 
				}  
			} 
			for (var i=0;i<_this.IndexLis.length;i++) {//模式点击开关为真
				_this.IndexLis[i].onOffLi = true;
			}
			_this.keyclick.style.display = 'block'; 
		}
	},
	btnFn2:function(){//设置中取消按钮
		var _this = this;
		this.btn[1].onclick = function(){
			_this.keySeta(); 
			for (var i=0; i<_this.keyArr.length; i++) {
				_this.keyArr1[i] = _this.keyArr[i]
			} 
		}
	},  
	musicPlay:function(num){//音乐
		if(this.music.onOff){
			this.audio.src = 'music/'+num+'.mp3';
			this.audio.load();
			this.audio.play();
		}
	},
	musicBtnClick:function(){//音乐按钮点击
		var _this = this;
		this.music.onOff = true;
		this.music.onclick = function(){
			if(this.onOff){
				_this.music.innerHTML = '关'; 
			}else{
				_this.music.innerHTML = '开'; 
			} 
			this.onOff = !this.onOff;
		}
	}, 
	getStyle:function(obj,attr) {//获取样式
		return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
	},  
	addZeroSs:function(num) { //补0
		if(num<10){
			return '0'+num;
		}else if(num>=10){
			return num; 
		}
	},
	addZero:function (num){//补0
		var str = String(num);
		var str1 = '';
		if(num<10){
			return 0+'.'+ 0 + 0 + str[0] +'/s';
		}else if(num>10 && num<100){
			return 0+'.'+ 0 + str[0] + str[1] +'/s';
		}else if(num>100 && num<1000){
			return 0+'.'+ str[0] + str[1] + str[2] +'/s';
		}else{
			for (var i=0; i<str.length; i++) {
				str1 += str[i];
				if(i == str.length - 4){
					str1 += '.';
				}else if(i == str.length - 1) {
					str1 += '/s';
				};
			};
			return str1;
		}
	} 
}
var gameBox = new Game('box');
gameBox.init();
