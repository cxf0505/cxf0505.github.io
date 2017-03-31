var div1 = document.getElementById('div');
var Index = document.getElementById('index');//首页选模式界面
var IndexLis = Index.getElementsByTagName('li'); 
var list = document.getElementById('list');//外层.游戏区域
var lis = list.getElementsByTagName('li');//一排  
var datS = document.getElementById('datS');//秒，游戏中
var progressBar = document.getElementById('progressBar');//游戏进度条
var show = document.getElementById('show');//显示层（得分状态）
var texta = show.children[0];//文字提示
var nowDate = show.getElementsByClassName('date')[0];//显示层的时间
var best = show.getElementsByClassName('best')[0].children[0];//历史最佳时间
var over = document.getElementById('over');//结束按钮
var nextContinue = document.getElementById('nextContinue');//继续玩按钮
var audio = document.getElementsByTagName('audio')[0];

var jjMode = document.getElementById('jj_mode')//街机模式中的
var jjModeLi = jjMode.getElementsByTagName('li')//街机模式中的几种效果li
var jjWy = document.getElementById('jj_wy');//乌云效果
var keyclick = document.getElementById('keyclick')//点击设置按钮
var music = document.getElementsByClassName('music')[0];
var key1 = document.getElementById('key');//游戏下方按键
var keyLis = key1.getElementsByTagName('li');//游戏下方按键li集合 
var keyset = document.getElementById('keyset');//按键设置框 
var keySetInput = keyset.getElementsByTagName('input');//最下方按键设置li集合 
var btn = document.getElementById('btn').children;//按键设置框确定/取消按钮
var s = 1000;
var x = 500;
var beginOnOff = false;  //游戏总开关
var timer = null;  
var keyArr = [65,83,75,76];//按键
var keyArr1 = [];//按键复制
var musicbtn = '开';//声音开关
var musicbtn1 = '';
var jsonKey = {
	81:'Q',87:'W',69:'E',82:'R',84:'T',89:'Y',85:'U',73:'I',79:'O',80:'P',
	65:'A',83:'S',68:'D',70:'F',71:'G',72:'H',74:'J',75:'K',76:'L',
	90:'Z',88:'X',67:'C',86:'V',66:'B',78:'N',77:'M'
} 

var blackArr = [];//存放需要按下的黑块
var bestArr = {//存放历史最佳时间
	jd:[],
	jj:[],
	c:[],
	js:[]
};
var mode = null;//存放模式
var ss = 0; //记录按下的个数。街机和禅模式需要用到；
//点击模式进入游戏
for (var i=0;i<IndexLis.length;i++) {
	IndexLis[i].onOffLi = true;
	IndexLis[i].index = i;
	IndexLis[i].onclick = function(){ 
		if(this.onOffLi){
			mode = this.index;
			for (var i=0;i<IndexLis.length;i++) {
				IndexLis[i].onOffLi = false; 
			}
			blackArr = [];  
			move(Index,{left:320},1000,'backIn')
			move(keyclick,{left:612},1000,'backIn')
			move(list,{left:0},1000,'backIn',function(){
				if(mode ==2||mode ==0){
				progressBar.style.display = 'block';//禅模式的进度条显示
					if(mode ==0){
						progressBar.style.width = 0;
					}
				}
				
			})
			move(key1,{opacity:1},1500,'backIn',function(){
				key1.style.display = 'block';
			})
			if(mode ==0||mode ==2||mode ==3){
				move(datS,{top:15},1000,'backIn')
			} 
			beginOnOff = true;//进入游戏开关为真
			randomLiDiv();
			console.log(mode)
			if(mode ==0){//经典模式 
				datS.innerHTML = '0.000/s';  
				mode0()
			} 
			if(mode ==1){//街机+模式 
				datS.innerHTML = '00';   
				mode1()
			} 
			if(mode ==2){//禅模式，时间1分钟 
				datS.innerHTML = '00'; 
				mode2() 
			} 
			if(mode ==3){//极速模式
				datS.innerHTML = '0.000/s'; 
				mode3()
			}  
		} 
	}
}
//初始黑块随机函数 
function randomLiDiv(){ 
	for (var i = lis.length-1;i>=0;i--) {  
		randomObj(lis[i]) 
		//最后一排加开始字符
		if(i == lis.length-1){
			var divIt = lis[i].getElementsByTagName('div');
			for (var j = 0; j<divIt.length; j++) {
				if(divIt[j].className == 'it'){
					divIt[j].innerHTML = '开始';  
				}
			}
		}
	} 
} 
//随机黑块函数
function randomObj(obj){
	console.log(blackArr)
	var divs = obj.getElementsByTagName('div');
	var randomX = Math.random()*100;
	var x = Math.floor( Math.random()*divs.length) ; 
	divs[x].className = 'it'; 
	divs[x].index = keyArr[x]//自定义属性、键值
	blackArr.push(divs[x])//把对象存入blackArr；  
}  
//音乐
function musicPlay(num){
	if(music.onOff){
		audio.src = 'music/'+num+'.mp3';
		audio.load();
		audio.play();
	}
}
//音乐按钮点击
music.onOff = true;
music.onclick = function(ev){
	if(this.onOff){
		music.innerHTML = '关'; 
	}else{
		music.innerHTML = '开'; 
	} 
	this.onOff = !this.onOff;
}
document.onmousedown = function(){
	return false;
}
//模式0经典
var divLength = 0;//块的个数，经典模式块走到20.计算进度条长度
var A1 = null;//存放当前按下的块、对象
function mode0(){
	//键盘按下事件、 
	window.top.document.onkeydown = function(ev){ 
		A1 = null;
		var ev = ev||event;  
		if(beginOnOff){ 
			for (var i = 0;i<keyArr.length;i++) {
				if(ev.keyCode == keyArr[i]){ 
					if(blackArr[0] && ev.keyCode == blackArr[0].index){ 
						musicPlay(i);
						divLength++;
						progressBar.style.width = divLength*16+'px';
						if(divLength <20){ 
							//变颜色为白 
							blackArr[0].className = 'item'; 
							blackArr.shift(blackArr[0]); 
							move(list,{top:0},50,'linear',function(){ 
								list.removeChild(lis[lis.length-1]); 
								var li = document.createElement('li');  
								for (var i = 0; i<lis.length;i++) {
									var div = document.createElement('div');
									if(divLength == 16||divLength == 17||divLength == 18){  
										div.style.background = '#6ae4f2';
											if(i==1 && divLength == 16){
													div.innerHTML = '终';
													div.style.textIndent = '40px';
											}else if(i==2 && divLength == 16){
													div.innerHTML = '点';
													div.style.textIndent = '-40px';
											}
									}else{
										div.className = 'item';
									} 
									li.appendChild(div);
								} 
								list.insertBefore(li,list.children[0])
								randomObj(li);   
								list.style.top = '-125px';  
							})   
							//开始    || 时间 
							clearInterval(timer);  
							timer = setInterval(function(){  
								s++; 
								var t = Math.round((s-1000)*0.014*1000);  
								datS.innerHTML = addZero(t);
								nowDate.innerHTML = addZero(t);   
							},14)   
						}else{  
							A1 = blackArr[1];
							blackArr[0].className = 'item';
							blackArr.shift(blackArr[0]);
							clearInterval(timer); 
							blackArr =[]; 
							texta.innerHTML = '人若无梦想，同咸鱼何异！';
							nowDate.innerHTML = datS.innerHTML;
							showBlockNone();
							divLength = 0;
						} 	 
					//检测按错键
					}else if(blackArr[0] && blackArr[0].innerHTML != '开始'){
						musicPlay('over');
						clearInterval(timer); 
						blackArr[0].style.background = 'red';  
						blackArr =[]; 
						texta.innerHTML = '人若无梦想，同咸鱼何异！';
						nowDate.innerHTML = '败了';
						showBlockNone();
						divLength = 0;
					}  
				}
			}	
		} 
	} 
}
//模式1街机
function mode1(){  
	move(jjMode,{opacity:1},1000,'backIn'); 
	jjMode.style.display = 'block';
	//街机模式中的效果
	for(var i=0;i<jjModeLi.length;i++){
		jjModeLi[i].onclick = function(){
			for(var i=0;i<jjModeLi.length;i++){
				jjModeLi[i].className = '';
			}
			this.className = 'red'; 
		}
	}
	//键盘按下事件、
	window.top.document.onkeydown = function(ev){
		var ev = ev||event; 
		if(beginOnOff){
			for (var i = 0;i<keyArr.length;i++) { 
				if(ev.keyCode == keyArr[i]){
					if(blackArr[0] && ev.keyCode == blackArr[0].index){
					move(jjMode,{opacity:0},200,'backIn',function(){
						jjMode.style.display = 'none'; 
						move(datS,{top:15},200,'backIn')
					}); 
						musicPlay(i);
						//街机中的几种效果  
						if(jjModeLi[0].className == 'red'){//乌云效果
							jjWy.style.display = 'block';  
							jjwyBlockNone(); 
						}else if(jjModeLi[1].className == 'red'){//震动效果
							shake(list,'left')
						
						}else if(jjModeLi[2].className == 'red'){//变速效果
						 	var bbb = Math.round(Math.random()*100) 
								if (bbb<40) {
									x=150; 
								} else if (bbb>=40&&bbb<80) {
									x=400; 
								}else if(bbb>=80){
									x=700; 
								}
						}//匀速效果判断函数在定时器里边 
						ss++;//点对的块数
						//变颜色为白
						blackArr[0].className = 'item';
						blackArr.shift(blackArr[0])
						//开始   
						var n = parseFloat(getStyle(list,'top'));
						clearInterval(timer); 
						timer = setInterval(function(){  
							s++;//时间 
							x-=0.14;  
							datS.innerHTML = addZeroSs(ss);
							nowDate.innerHTML = addZeroSs(ss);  
							if(jjModeLi[3].className == 'red'){//匀速效果找自信
								s=1000;
								x=250;
							}
							n = n+s/x; 
							if(n>=0){
								//有没有黑色没按
								if(blackArr[0] && blackArr[0].offsetTop == div1.offsetHeight-1){ 
									musicPlay('over');
									clearInterval(timer);
									beginOnOff = false;
									blackArr[0].style.background = 'red';
									move(list,{top:-125},200,'easeIn',function(){
										showBlockNone();
									});
									return;
								}else{
									list.removeChild(lis[lis.length-1]); 
									var li = document.createElement('li');  
									for (var i = 0; i<lis.length;i++) {
										var div = document.createElement('div');
										div.className = 'item';
										li.appendChild(div);
									} 
									list.insertBefore(li,list.children[0])
									randomObj(li);	
								} 
								n = -125;
							}
							console.log(s/x)
							list.style.top = n+'px';
						},14)  
						//检测按错键
					}else if(blackArr[0] && blackArr[0].innerHTML != '开始'){
						musicPlay('over');
						clearInterval(timer); 
						blackArr[0].style.background = 'red';  
						blackArr =[];
						showBlockNone();
						texta.innerHTML = '别放弃挑战哦，再来一次GO！' 
					} 
				} 
			} 
		} 
	} 
}
//街机中乌云效果  
function jjwyBlockNone(){  
	if(jjWy.offsetTop == '-100'){   
		move(jjWy,{top:250},2000,'easeIn')
	}else if(jjWy.offsetTop == 250){ 
		move(jjWy,{top:-100},500,'linear')
	} 
}

//模式2禅 
function mode2(){
	//键盘按下事件、
	window.top.document.onkeydown = function(ev){ 
		var ev = ev||event;  
		if(beginOnOff){
			for (var i = 0;i<keyArr.length;i++) {
				if(ev.keyCode == keyArr[i]){
					if(blackArr[0] && ev.keyCode == blackArr[0].index){ 
						musicPlay(i);
						ss++;
						//变颜色为白 
						blackArr[0].className = 'item';
						blackArr.shift(blackArr[0]);
						datS.innerHTML = addZeroSs(ss); 
						nowDate.innerHTML = addZeroSs(ss); 
						move(list,{top:0},15,'linear',function(){  
							list.removeChild(lis[lis.length-1]);
							var li = document.createElement('li');  
							for (var i = 0; i<lis.length;i++) {
								var div = document.createElement('div');
								div.className = 'item';
								li.appendChild(div);
							} 
							list.insertBefore(li,list.children[0])
							randomObj(li);	
							list.style.top = '-125px';
						})   
						//开始    
						clearInterval(timer);  
						timer = setInterval(function(){  
							progressBar.style.width = (x-180)+'px';
							x-=0.34; 
							if( x-180<=0.1 ){
								clearInterval(timer)
								showBlockNone();
							}
						},14)   
						//检测按错键
					}else if(blackArr[0] && blackArr[0].innerHTML != '开始'){
						musicPlay('over');
						clearInterval(timer); 
						blackArr[0].style.background = 'red';  
						blackArr =[];
						showBlockNone();
						texta.innerHTML = '为新记录冲刺把！'; 
					}  
				} 
			} 
		} 
	} 
} 
//模式3极速
function mode3(){
	//键盘按下事件、
	window.top.document.onkeydown = function(ev){  
		var ev = ev||event; 
		if(beginOnOff){
			for (var i = 0;i<keyArr.length;i++) { 
				if(ev.keyCode == keyArr[i]){
					if(blackArr[0] && ev.keyCode == blackArr[0].index ){
						musicPlay(i);
						//变颜色为白
						blackArr[0].className = 'item';
						blackArr.shift(blackArr[0])
						//开始   
						var n = parseFloat(getStyle(list,'top'));
						clearInterval(timer); 
						timer = setInterval(function(){  
							s++;
							x-=0.14
							var t = Math.round((s-1000)*0.014*1000); 
							datS.innerHTML = addZero(t);
							nowDate.innerHTML = addZero(t);
							n = n+s/x; 
							if(n>=0){
								//有没有黑色没按
								if(blackArr[0] && blackArr[0].offsetTop == div1.offsetHeight-1){
									musicPlay('over');
									beginOnOff = false;
									clearInterval(timer); 
									blackArr[0].style.background = 'red';
									move(list,{top:-125},200,'easeIn',function(){
										showBlockNone();
									});
									return;
								}else{
									list.removeChild(lis[lis.length-1]); 
									var li = document.createElement('li');  
									for (var i = 0; i<lis.length;i++) {
										var div = document.createElement('div');
										div.className = 'item';
										li.appendChild(div);
									} 
									list.insertBefore(li,list.children[0])
									randomObj(li);	
								} 
								n = -125;
							}
							list.style.top = n+'px';
						},14)  
						//检测按错键
					}else if(blackArr[0] && blackArr[0].innerHTML != '开始'){
						musicPlay('over');
						clearInterval(timer); 
						blackArr[0].style.background = 'red';  
						blackArr =[];
						showBlockNone();
						texta.innerHTML = '别放弃挑战哦，再来一次GO！' 
					} 
				} 
			} 
		} 
	} 
}
//补0函数
function addZeroSs(num){ 
	if(num<10){
		return '0'+num;
	}else if(num>=10){
		return num; 
	}
}
//补0函数
function addZero(num){
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
	};
};
//显示层显示函数/隐藏函数
function showBlockNone(){
	if(show.style.display == 'block'){ 
		show.style.display = 'none'; 
		beginOnOff = true; 
		move(show,{opacity: 0},1000,'easeIn') 
	}else{
		show.style.display = 'block';
		jjWy.style.display = 'none';//乌云关闭
		jjWy.style.top = '-100px'; 
		beginOnOff = false;
		move(show,{opacity: 1},1000,'easeIn');
		//显示层显示时，把得分加入数组   
		if(mode == 0 && A1!=null){//0经典-最佳得分，只包括成功的、 
			bestArr.jd.push( parseFloat( nowDate.innerHTML ) ) ; 
			bestArr.jd.sort(function(a,b){
				return a-b;
			})  
			return best.innerHTML = bestArr.jd[0] +'/s';
		}else if(mode == 0 &&bestArr.jd.length>0){ //
			return best.innerHTML = bestArr.jd[0] +'/s'; 
		}else if(mode == 0 &&bestArr.jd.length==0){ //
			return best.innerHTML = '0.000/s'; 
		}
		//街机最佳得分的函数
		if(mode == 1){
			bestArr.jj.push( parseFloat( nowDate.innerHTML ) ) ; 
			bestArr.jj.sort(function(a,b){
				return b-a;
			})
			return best.innerHTML = addZeroSs(bestArr.jj[0]);
		} 
		//禅模式最佳得分的函数
		if(mode == 2){
			bestArr.c.push( parseFloat( nowDate.innerHTML ) ) ; 
			bestArr.c.sort(function(a,b){
				return b-a;
			})
			return best.innerHTML = addZeroSs(bestArr.c[0]) ;
		}
		//极速最佳得分的函数
		if(mode == 3){
			bestArr.js.push( parseFloat( nowDate.innerHTML ) ) ;
			bestArr.js.sort(function(a,b){
				return b-a;
			})
			return best.innerHTML = bestArr.js[0] +'/s';
		} 
		
	}  
}  
//点击结束按钮，返回首页面
over.onclick = function(){
	showBlockNone(); 
	keyclick.style.left = '-28px'; 
	Index.style.left = '-320px'; 
	move(list,{left:320},800,'easeIn',function(){
		//当首页全部展现的时候，可以点击模式，为true；
		for (var i=0;i<IndexLis.length;i++) {
			IndexLis[i].onOffLi = true; 
		}
	})
	move(datS,{top:-40},800,'easeIn')
	beginOnOff = false;//返回首页开关为假
	move(keyclick,{left:292},800,'easeIn')
	move(Index,{left:0},800,'easeIn',function(){
		removeStyle();
		list.style.top = '-125px';
		datS.innerHTML = '0.000/s';
	})
	s = 1000;
	x = 500;
	ss = 0;
	//点击结束，分度条关闭，初始化
	progressBar.style.width = 320+'px';
	progressBar.style.display = 'none';
	move(key1,{opacity:0},1500,'backIn',function(){
		key1.style.display = 'none'; 
		keyclick.style.display = 'block';
	}) 
}
//点击继续玩按钮，重新载入游戏
nextContinue.onclick = function(){
	blackArr = [];
	removeStyle();
	showBlockNone();
	randomLiDiv();
	beginOnOff = true;
	list.style.top = '-125px';
	if(mode ==0||mode ==3){//经典模式、极速模式
		datS.innerHTML = '0.000/s';
		progressBar.style.width = 0+'px';
	}else if(mode ==2){//禅模式
		datS.innerHTML = '00';
		progressBar.style.width = 320+'px'; 
	}else if(mode ==1){//街机模式
		datS.innerHTML = '00';
	} 
	s = 1000;
	x = 500;
	ss = 0;
	//点击重玩，分度条初始化 
}
//清除块的样式
function removeStyle(){
	var divs = list.getElementsByTagName('div');
	for (var i=0;i<divs.length;i++) {
		divs[i].className = 'item';
		divs[i].style.cssText = '';
		divs[i].innerHTML = '';
	}
} 
//点击自定义游戏按键设置 
var keysetInput = keyset.getElementsByClassName('keyright');//点击自定义游戏按键设置
keyclick.onclick = function(){ 
	keyset.style.display = 'block';
	for (var i=0; i<keyArr.length; i++) {
		keyArr1[i] = keyArr[i]
	}
	for (var i=0;i<IndexLis.length;i++) {//模式点击开关为假
		IndexLis[i].onOffLi = false;
	} 
	this.style.display = 'none';
}

var a = null; //点击的是第几个按键，存一下
for (var i=0;i<keysetInput.length;i++) {
	keysetInput[i].index1 = i;
	keysetInput[i].onclick = function(){ 
		a = this.index1;  
		window.top.document.onkeydown = function(ev){  
			var ev = ev||event;  
			if(jsonKey[ev.keyCode]){//如果是26个字母中的 
				if(keyArr1.indexOf(ev.keyCode) != -1){ 
					keysetInput[keyArr1.indexOf(ev.keyCode)].innerHTML = ' '; 
					keyArr1[keyArr1.indexOf(ev.keyCode)] = null;
				}  
				keysetInput[a].innerHTML = 	jsonKey[ev.keyCode]; 
				keyArr1[a] = ev.keyCode; 
			}else{
				alert('请设置26个英文字母为游戏按键哦！！！')
				return;
			} 
		} 
	}
}
//按键确定按钮
btn[0].onclick = function(){
	for (var i=0;i<keyArr1.length;i++) {
		if(keyArr1[i] == null){ 
			return alert('游戏按键不能为空');
		}else{
			keyArr[i] = keyArr1[i];
			keyLis[i].innerHTML = keysetInput[i].innerHTML;
			keyset.style.display = 'none'; 
		}  
	} 
	for (var i=0;i<IndexLis.length;i++) {//模式点击开关为真
		IndexLis[i].onOffLi = true;
	}
	keyclick.style.display = 'block'; 
}
//按键取消按钮
btn[1].onclick = function(){
	keyseta(); 
	for (var i=0; i<keyArr.length; i++) {
		keyArr1[i] = keyArr[i]
	} 
}
//按键默认函数
keyseta();
function keyseta(){
	for (var i=0;i<keysetInput.length;i++) {
		if(jsonKey[keyArr[i]]){
			keysetInput[i].innerHTML = jsonKey[keyArr[i]];
		} 
	}  
}

//获取样式
function getStyle(obj,attr) {
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}
