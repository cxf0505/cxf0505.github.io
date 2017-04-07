var data = [
	{
		'id':1,
		'name':'我的应用数据1',
		'pId':0
	},
	{
		'id':2,
		'name':'我的应用数据2',
		'pId':0
	},
	{
		'id':3,
		'name':'我的应用数据3',
		'pId':0
	},
	{
		'id':4,
		'name':'我的应用数据4',
		'pId':0
	},
	{
		'id':5,
		'name':'我的应用数据1-1',
		'pId':1
	}, 
	{
		'id':6,
		'name':'我的应用数据2-1',
		'pId':2
	},
	{
		'id':7,
		'name':'我的应用数据1-2',
		'pId':1
	},
	{
		'id':8,
		'name':'我的应用数据1-2-1',
		'pId':7
	},
	{
		'id':9,
		'name':'我的应用数据1-2-2',
		'pId':7
	},
	{
		'id':10,
		'name':'我的应用数据1-2-1-1',
		'pId':8
	} 
];  
var menu_left = document.getElementById('menu_left');//左
var menu3 = document.getElementById('menu3');//导航条
var newBuilt = document.getElementById('menu2');//内容上侧的新建文件夹；
var removeBuilt = document.getElementById('remove_1'); //删除按钮
var rename = document.getElementById('rename');//重命名按钮
var oUl = document.getElementById('docu');//内容区外层  
var crumb = document.getElementById('crumb');//面包屑导航区域
var crumbChild0 = document.getElementById('crumb_child0');//页面初始的全部文件/外层
var crumbChild1 = document.getElementById('crumb_child1');//全部文件和返回上一级/外层
var loadFilesNum = document.getElementById('num');//已全部加载，共几个
var returnCdup = crumbChild1.children[0];//返回上一级按钮
var allFile = crumbChild1.children[1];//返回全部文件按钮
var crumbChild2 = document.getElementById('crumb_child2');//面包屑文件名/外层
var crumbSpan = crumbChild2.getElementsByTagName('span');////面包屑文件名
var crumbA = crumbChild2.getElementsByTagName('a');////面包屑>符号
var aLi = oUl.getElementsByTagName('li');//li的集合  
var aP = oUl.getElementsByTagName('p');//ul中所有的p
var checkAll = document.getElementById('checkAll');//全选按钮
var checkAllText = checkAll.nextElementSibling;//全选后的文字
var filesTuo = document.getElementById('files_tuo');
var block = document.getElementById('block');//框选
var blockText = document.getElementById('blockText');//文件夹的右键菜单
var oLiOndblclick1 = blockText.children[0];//文件夹的右键菜单的打开按钮 
var rename1 = blockText.children[1];//文件夹的右键菜单的重命名按钮
var removeBuilt1 = blockText.children[2];//文件夹的右键菜单的删除按钮
var textMenu = document.getElementById('textMenu');//文字右键菜单
var textMenuAs = textMenu.getElementsByTagName('a');//文字右键菜单的a
var textMenuUls = textMenu.getElementsByTagName('ul');//文字右键菜单的ul;
var newBuilt1 =  textMenu.children[5];//文字右键菜单的新建文件夹按钮 
var n = 0;//点击取消时，默认的文件名n++;
var num = data.length;//和id是对应的 
var path = [];//pId存放；
var hash = location.hash?location.hash.split('=')[1]:'0';
//渲染data的数据
for(var i = 0;i<data.length;i++){
	if(data[i].pId == hash){//默认走hash为0
		createDate(data[i]);
	} 
} 
//渲染data数组中的一条数据函数
function createDate(d){  
	var oLi = document.createElement('li'); 
	var checkbox_inp = document.createElement('div'); 
	checkbox_inp.className = 'checkbox_inp';
	oLi.appendChild(checkbox_inp);
	var che_b = document.createElement('div'); 
	che_b.className = 'che_b';
	oLi.appendChild(che_b); 
	var oP = document.createElement('p');   
	oP.innerHTML = d.name; 
	oLi.num = d.id;   
	oLi.appendChild(oP);  
	//li的移入、移出、inpt点击效果函数  
	oLi.onmouseover = liOnmouseover;
	oLi.onmouseout = liOnmouseout; 
	//li的双击事件  
	oLi.ondblclick = function(){
		ondblclickfn(this);
	} 
	//生成的text盒子
	createText(oLi)
	//点击文件夹左上角方块的函数、和判断是否全选
	filesBlockClick();
	checkAllText.innerHTML = '全选';
	menuBlock()//导航条显示隐藏判断
} 
//li双击事件函数、和右键打开
function ondblclickfn(obj){
	if(!newBuilt1.onOff || !newBuilt.onOff||!rename.onOff ||!rename1.onOff){ 
		return;
	}  
	console.log(obj.num) 
	var arr = [];
	oUl.innerHTML = '';
	for (var i=0;i<data.length;i++) {
		if(data[i].pId == obj.num){
			arr.push(data[i]); 
		} 
	}  
	for (var i=0;i<arr.length;i++) { 
		createDate(arr[i])
	}   
	//面包屑导航的生成  
	location.hash = '#path ='+obj.num;
	crumbChild0.style.display = 'none';
	crumbChild1.style.display = 'block';//返回上一级和全部文件显示  
	crumbChild2.style.display = 'block';
	for (var i=0;i<data.length;i++) {
		if(data[i].id == obj.num){
			path.push(data[i].pId)//点击进入时，把文件夹的pid扔给path
			var span = document.createElement('span');
			span.innerHTML = data[i].name; 
			var te = document.createElement('a'); 
			te.innerHTML = '>'; 
			crumbChild2.appendChild(te);
			crumbChild2.appendChild(span);  
		}
	}
	loadFilesNumFn();//已全部加载，共几个
	var span = crumbChild2.getElementsByTagName('span');
	for (var i=0;i<span.length-1;i++) {
		span[i].index = i;
		//面包屑文件名的点击效果
		span[i].onclick = function(){ 
			if(!newBuilt1.onOff || !newBuilt.onOff){
				return;
			} 
			loadFilesNumFn();
			console.log(path,location.hash)
			oUl.innerHTML = ''; 
			for(var i = 0;i<data.length;i++){
				if(data[i].pId == path[this.index+1]){
					location.hash = '#path ='+data[i].pId;
					createDate(data[i]);
				} 
			}
			for (var i=this.index+1;i<span.length--;i++) {  
				crumbChild2.removeChild(crumbA[i])
				crumbChild2.removeChild(crumbSpan[i])
				if(path[i] == !0){
					path.pop(i); 
				} 
				i--;
			}  
			console.log(path) 
			loadFilesNumFn();
		} 
	} 
	allActive();
}  
//点击文件夹左上角方块的函数、和判断是否全选 
filesBlockClick();
function filesBlockClick(){ 
	for(var i = 0;i<aLi.length;i++){ 
		fn(i) 
	}	
	function fn(i){
		var oCheckBox = aLi[i].children[0];
		oCheckBox.onOff = true;
		oCheckBox.ondblclick = function(ev){//双击阻止后续捕获、冒泡
			var ev = ev||event; 
			ev.cancelBubble = true;
		}
		oCheckBox.onclick = function(ev){ 
			if(!newBuilt1.onOff || !newBuilt.onOff||!rename.onOff ||!rename1.onOff){ 
				return;
			}  
			var ev = ev||event; 
			checkAll.className = 'active'; 
			checkAll.onOff = false; 
			var oLi = this.parentNode;
			if(this.onOff){ 
				oLi.className = 'active';  
				checkAll.className = 'active';
				for(var i = 0;i<aLi.length;i++){
					if(aLi[i].className == ''){ 
						checkAll.className = ''; 
						checkAll.onOff = true;
					} 
				}
			}else{
				oLi.className = 'hover'; 
				checkAll.className = ''; 
				checkAll.onOff = true;
				checkAll.nextElementSibling.innerHTML = '全选';
			}  
			oCheckBox.onOff = !oCheckBox.onOff; 
			menuBlock()
		} 
	} 
} 

//生成的text盒子函数
function createText(obj){
	var input_text = document.createElement('div'); 
		input_text.className = 'input_text';
		input_text.style.display = 'block';
		var input_1 = document.createElement('input');
		input_1.type = 'text'; 
		input_1.value = '新建文件夹'
		input_text.appendChild(input_1);
		var span_1 = document.createElement('span');
		var span_2 = document.createElement('span');
		input_text.appendChild(span_1);
		input_text.appendChild(span_2); 
		input_text.style.display  ='none'
		obj.appendChild(input_text);
	oUl.appendChild(obj); //每个li插入到Ul中 
}

//点击删除按钮的点击函数
removeBuilt.onclick = reMove; 
removeBuilt1.onclick = reMove;//右键菜单的删除按钮
//删除文件函数
var arrlia = []; //删除文件的时候存放下文件夹的ID
function reMove(){  
	checkAllText.innerHTML = '全选';
	arrlia = [];
	for (var i = 0; i<aLi.length--;i++) {
		if(aLi[i].className == 'active'){    
			for (var j=0;j<data.length;j++) { 
				if(data[j].id == aLi[i].num){
					arrlia.push(data[j].id);
					fn(data[j].id)//先找到当前选中的文件夹的id
					function fn(d){ //递归找数据的id
						for (var j=0;j<data.length;j++) { 
							if(data[j].pId == d){
								arrlia.push(data[j].id);//一层一层往下找 
								fn(data[j].id) 
							}
						} 
					}  
				} 
				for (var k=0;k<arrlia.length;k++) { 
					for (var s=0;s<data.length;s++) { 
						if(data[s].id == arrlia[k]){
							data.splice(s,1) //根据找到的id删除data数据
						}
					}
				}
			}   
			oUl.removeChild(aLi[i]); //点击删除,把页面中对应的也删除  
			newBuilt.onOff = true; 
			newBuilt1.onOff = true; 
			i--;
		}   
	}  
//	console.log(arrlia) 
	allActive()//判断是否全选 
	loadFilesNumFn(); //本页面加载文件夹，共几个
	menuBlock()
	console.log(data)
} 

//返回上一级文件夹函数
returnCdup.onclick = function(){ 
	if(!newBuilt1.onOff || !newBuilt.onOff){
		return;
	} 
	oUl.innerHTML = '';
	//删除面包屑文件名最后一个 和 > 箭头 
	crumbChild2.removeChild(crumbA[crumbA.length-1])
	crumbChild2.removeChild(crumbSpan[crumbSpan.length-1])
	crumbSpanBlock();//判断面包屑显示隐藏
	var hash = location.hash?location.hash.split('=')[1]:'0';   
	//删除数组最后一位、并渲染页面.通过path；
	for(var i = 0;i<data.length;i++){  
		if(data[i].id == hash){ 
			for(var j = 0;j<data.length;j++){
				if(data[j].pId == data[i].pId){
					location.hash = '#path ='+data[j].pId;
					createDate(data[j]);
				} 
			} 
		}  
	} 
	path.pop();
	loadFilesNumFn();//本页面加载文件夹，共几个 
	allActive()//判断是否全选函数
}
//返回全部文件点击函数
allFile.onclick = function(){
	if(!newBuilt1.onOff || !newBuilt.onOff){
		return;
	} 
	path.length = 0;
	oUl.innerHTML = '';
	crumbChild2.innerHTML = '';
	crumbSpanBlock()//显示隐藏
	location.hash = '#path='+0;
	for(var i = 0;i<data.length;i++){
		if(data[i].pId == 0){//回到hash为0
			createDate(data[i]);
		} 
	}
	console.log(path)
	loadFilesNumFn();//本页面加载文件夹，共几个
} 
//新建文件夹的点击函数 
newBuilt1.onOff = newBuilt.onOff = true;//新建文件夹的开关；
newBuilt.onclick = newBuilt1.onclick= function(){ 
	newBuiltOnclick(this);
}
function newBuiltOnclick(obj){  
	if(!newBuilt1.onOff || !newBuilt.onOff||!rename.onOff ||!rename1.onOff){ 
		return;
	}  
	var hash = location.hash?location.hash.split('=')[1]:'0';
	if(obj.onOff){  
		for (var i=0;i<aLi.length;i++) {//点击新建文件夹以后取消文件夹选中状态
			aLi[i].className = '';
			aLi[i].children[0].onOff = true;
		} 
		obj.onOff  = false;  
		var josn = {};
		num++; 
		josn.id = num;
		josn.name = '新建文件夹'; //现在数组中生成的name的值，是初始值 
		josn.pId = hash?hash:0;  
		data.push(josn);  
		createDate(data[data.length-1]);//每次点击生成数组最后一个的数据  
		oUl.insertBefore(aLi[aLi.length-1],aLi[0]); //让li在前面，换下位置  
		var p = aLi[0].children[2];//当前显示的这一个p文字  
		var tex =aLi[0].children[3];//当前显示的这一个输入框
		p.style.display = 'none';  
		tex.style.display = 'block'; 
		var btnText = tex.children[0];//输入框 
		var btnY = tex.children[1];//确定
		var btnN = tex.children[2];//取消  
		btnText.select();  
		document.onclick = function(){
			btnText.focus();
		}
		//确定按钮的点击
		btnY.onclick = btnYfn;
		function btnYfn(){
			var val = btnText.value;//获取输入框的value； 
			if(val.length>10){//限制下输入框的字数
				alert('字数过多')
				return;
			}
			if(val == josn.name ){//如果val没有变化的话（还是初始值），给页面插入自定义的名字。
				n++;
				p.innerHTML = '新建文件夹（'+ n +'）'; 
			}else{
				p.innerHTML = val;
			}
			this.parentNode.style.display = 'none';  
			p.style.display = 'block';  
			for (var i = 0; i<data.length;i++) {
				if(data[i].id == this.parentNode.parentNode.num){
					data[i].name = p.innerHTML;//点击确定后，修改下data数据
				} 
			}  
			obj.onOff = true; 
			loadFilesNumFn();
			btnText.blur();
			console.log(data)    //data数据已是当前页面的数据 
		} 
		//取消按钮的点击
		btnN.onclick = btnNfn;
		function btnNfn(){
			oUl.removeChild(this.parentNode.parentNode) 
			data.pop() //点击取消按钮后，删除下data的数据 
			obj.onOff = true; 
//				console.log(data)    //data数据已是当前页面的数据
		}
		removeBuilt.onclick = reMove;//删除按钮函数 
		removeBuilt1.onclick = reMove;//删除按钮函数 
		allActive();//判断是否全选  
		btnText.blur();
		menuBlock();
	}  
}   

//重命名点击函数 
rename1.onOff = rename.onOff = true;    
rename1.onclick = rename.onclick= function(){  
	allActive()//判断是否全选  
	renameFunction(this);
} 
function renameFunction(obj){//重命名点击函数 
	if(!newBuilt1.onOff || !newBuilt.onOff||!rename.onOff ||!rename1.onOff){ 
		return;
	}  
	var nActive = []; //存下选中了几个文件夹
	for (var i = 0; i<aLi.length;i++) {
		if(aLi[i].className == 'active'){
			nActive.push({
				o:aLi[i]
			}); 
		}
	} 
	if(obj.onOff && nActive.length ==1){ //如果选中的只有一个文件夹才走重命名 
		obj.onOff = false; //自身开关关闭   
		var p = nActive[0].o.children[2];//当前选中需要隐藏的p
		var tex = nActive[0].o.children[3];//当前需要显示的tex盒子
		var btnText = tex.children[0];//当前需要赋值的input输入框；
		var btnY = tex.children[1];//确定按钮
		var btnN = tex.children[2];//取消按钮
		nActive[0].o.className = ''; 
		nActive[0].o.children[0].onOff = true; 
		var val = p.innerHTML; 
		btnText.value = val; 
		btnText.select();  
		document.onclick = function(){
			btnText.focus();
		}
		p.style.display = 'none'; 
		tex.style.display = 'block' ;
		 //点击确定按钮
		btnY.onclick =  function(){
			var val = btnText.value; //获取输入框的value； 
			if(val.length>10){//限制下输入框的字数
				alert('字数过多')
				return;
			} else if(val.length == 0){
				alert('你没有输入，请输入')
				return;
			}  
			this.parentNode.style.display = 'none';  
			p.style.display = 'block';  
			p.innerHTML = val;
			for (var i = 0; i<data.length;i++) {
				if(data[i].id == this.parentNode.parentNode.num){
					data[i].name = p.innerHTML;//点击确定后，修改下data数据
				} 
			}   
			console.log(data) 
			obj.onOff = true; //自身开关打开  
		}
		//取消按钮的点击
		btnN.onclick = function(){
			p.innerHTML = val;
			this.parentNode.style.display = 'none';  
			p.style.display = 'block'; 
//						console.log(data)    //data数据已是当前页面的数据
			obj.onOff = true; //自身开关打开  
		}  
		console.log(1) 
		menuBlock();
	}
}
//全选按钮的点击 
checkAll.onOff = true;
checkAll.onclick = function(){
	if(!newBuilt1.onOff || !newBuilt.onOff||!rename.onOff ||!rename1.onOff){ 
		return;
	}  
	if(checkAll.onOff){
		this.className = 'active';
		checkAllText.innerHTML = '已选中'+aLi.length+'/'+aLi.length+'个文件夹';
		for (var i = 0;i<aLi.length;i++) {
			aLi[i].className = 'active';
			aLi[i].children[0].onOff = false;
		} 
//		newBuilt.onOff = newBuilt1.onOff = false;//全选状态时，新建文件夹禁用， 
	}else{
		this.className = '';
		checkAllText.innerHTML = '全选';
		for (var i = 0;i<aLi.length;i++) {
			aLi[i].className = '';
			aLi[i].children[0].onOff = true;
		} 
//		newBuilt.onOff = newBuilt1.onOff = true;//不是全选状态时，新建文件夹打开， 
	} 
	checkAll.onOff =! checkAll.onOff;
	menuBlock(); 
} 
//框选
blockbox()
function blockbox(){
	document.onmousedown = function(ev){  
		if(!newBuilt1.onOff || !newBuilt.onOff||!rename.onOff ||!rename1.onOff){ 
			return;
		}  
		var ev = ev||event; 
		ev.preventDefault();
		if(ev.target == oUl){ 
			var oldL = ev.clientX;
			var oldT = ev.clientY;
			document.onmousemove = function(ev){ 
				var ev = ev||event;  
				block.style.display = 'block';   
				var L = ev.clientX>oldL?oldL:ev.clientX;
				var T = ev.clientY>oldT?oldT:ev.clientY;
				var w = Math.abs(oldL-ev.clientX) ;
				var h = Math.abs(oldT-ev.clientY) ; 
//				if(L<oUl.getBoundingClientRect().left+5){
//					L = oUl.getBoundingClientRect().left+5;
//				}
//				if(T<oUl.getBoundingClientRect().top+5){
//					T =oUl.getBoundingClientRect().top+5;
//				}  
//				if(L +w >oUl.offsetLeft +oUl.offsetWidth){
//					w = oUl.offsetLeft +oUl.offsetWidth-L-2;
//				} 
//				if(h +T >oUl.offsetHeight +oUl.offsetTop){
//					h = oUl.offsetHeight + oUl.offsetTop-T-2;
//				} 
				block.style.width = w +'px';
				block.style.height = h+ 'px';
				block.style.left = L+ 'px';  
				block.style.top = T+'px'; 
				for (var i=0;i<aLi.length;i++) { 
					if(duang(block,aLi[i])){
						aLi[i].className = 'active'; 
						aLi[i].children[0].onOff = false; 
					}else{
						aLi[i].className = '';
						aLi[i].children[0].onOff = true;
					}   
				}   
				allActive();//判断是否全选
				menuBlock();
			} 
		}
		document.onmouseup = function(){ 
			block.style.cssText = '';
			document.onmousemove = document.onmouseup = null;  
		} 
	}
}
 
//碰撞检测
function duang(obj1,obj2){
	var client1 = obj1.getBoundingClientRect();
	var client2 = obj2.getBoundingClientRect(); 
	if(client1.right<client2.left || client1.bottom<client2.top || client1.left>client2.right || client1.top>client2.bottom){
 		return false;
	}else{  
		return true;
	}
}
//拖拽文件夹 
var arrLi = []; 
var onmoveOff = false;
var aId = 0;//拖拽目标文件夹的id
oUl.onmousedown = function(ev){ 
	if(!newBuilt1.onOff || !newBuilt.onOff||!rename.onOff ||!rename1.onOff){ 
		return;
	}  
	var ev = ev||event; 
	arrLi = []; 
	var l = ev.clientX;
	var t = ev.clientY; 
	for(var i = 0;i<aLi.length;i++){ 
		if(aLi[i].className =='active'){
			aLi[i].onOff = true;
			arrLi.push({
				id:aLi[i] 
			})  	
			//如果按下的是active的对象才执行  下面move 
		}else{
			aLi[i].onOff = false;
		}
	}
	for (var i=0;i<arrLi.length;i++) {
		if(ev.target == arrLi[i].id || ev.target.parentNode == arrLi[i].id){ 
			onmoveOff = true;//开关为真走拖拽 
		}
	}   
	document.onmousemove = function(ev){ 
		var ev = ev||event; 
		ev.preventDefault();//移动阻止默认行为
		if(onmoveOff){
			var nowX = ev.clientX;
			var nowY = ev.clientY;  
			if(l-nowX>20|| t-nowY >20||l-nowX<-20|| t-nowY <-20){//移动20才执行
				filesTuo.style.display = 'block';
				filesTuo.style.left = nowX +'px';
				filesTuo.style.top = nowY +'px'; 
			} 		
		} 
		document.onmouseup = function(ev){  
			var ev = ev||event; 
//			console.log(arrLi)
			for (var i =0;i<aLi.length;i++) {
				if(aLi[i].className !='active'){  //如果不是选中的文件夹才有下面的碰撞
					if(duang(filesTuo,aLi[i])){//如果碰撞上了  
						aId = aLi[i].num ;//存一下目标文件夹的id
			//						console.log(aLi[i])  
						for (var j =0;j<arrLi.length;j++) {
							for (var k =0;k<data.length;k++) {
								if(data[k].id == arrLi[j].id.num){
									data[k].pId = aId; //data数据更改。把选中的文件夹的pId改为目标文件夹的id；
								} 
						  	}
							oUl.removeChild(arrLi[j].id)
						} 
					}  
				} 
			}	
			//			console.log(data)
			if(onmoveOff){  
				//本页面加载文件夹，共几个
				loadFilesNumFn();
				onmoveOff = false;
				filesTuo.style.cssText = '';
				document.onmousemove = document.onmouseup = null; 
			}  
			menuBlock();
		}
	} 
}


//右键文件夹菜单的 （打开文件夹） 按钮
oLiOndblclick1.onclick = function(){ 
	ondblclickfn(lL) 
} 
var lL = null;//右键的时候存放下按下的对象
//右键菜单
oUl.oncontextmenu = function(ev){
	var ev = ev||event;
	ev.preventDefault();
	if(!newBuilt1.onOff || !newBuilt.onOff||!rename.onOff ||!rename1.onOff){ 
		return;
	}   
	var l = ev.clientX;
	var t = ev.clientY; 
	if(ev.target.parentNode.parentNode== oUl){
		if(ev.which ==3){  
			lL = ev.target.parentNode;
			ev.target.parentNode.className = 'active';
			ev.target.parentNode.children[0].onOff = false; 
		} 
		blockText.style.display = 'block';
		blockText.style.left = l+'px';
		removeBuilt1.onclick = reMove;//右键菜单的删除按钮
		blockText.style.top = t+'px';
		textMenu.style.display = '';
	}else if (ev.target.parentNode !== oUl){
		if(ev.which == 3){
		textMenu.style.display = 'block';
//		blockText.style.display = '';
		textMenu.style.left	= l+'px';
		textMenu.style.top = t+'px'; 
		} 
	} 
	allActive()//判断是否全选
	oUl.onmousedown = function(ev){  
		blockText.style.display = '';
		textMenu.style.display = '';
	}
} 

//右键文字菜单
textMenu.onclick = function(){//点过自己以后消失
	textMenu.style.cssText = ''; 
}

//右键文字菜单a的移入移出；  
for(var i=0;i<textMenuAs.length;i++){
	textMenuAs[i].index = i;  
	textMenuAs[i].onmouseover = function(){ 
		for(var i=0;i<textMenuUls.length;i++){
			textMenuUls[i].style.display = 'none';
		}
		if(this.nextElementSibling){
			this.nextElementSibling.style.display = 'block';
			this.nextElementSibling.style.top = this.offsetTop + 'px';
		} 
	}  
}  
//右键文件夹菜单点击
blockText.onclick = function(){//点过自己以后消失
	for (var i=0;i<aLi.length;i++) {//点击自己以后取消文件夹选中状态
		aLi[i].className = '';
		aLi[i].children[0].onOff = true;
	}
	blockText.style.display = ''; 
}
//面包屑导航的显示隐藏
function crumbSpanBlock(){
	for (var i = 0;i<crumbSpan.length;i++) { 
	}
	if(i == 0){
		crumbChild1.style.display = 'none';
		crumbChild0.style.display  ='block';
	}
}

//li移入效果函数
function liOnmouseover(){
	if(this.className ==''){
		this.className = 'hover';
	} 
}
//li移出效果函数
function liOnmouseout(){
	if(this.className == 'hover'){
		this.className = '';
	}else{
		this.className = 'active';
	}
} 
//本页面加载文件夹，共几个
loadFilesNumFn();
function loadFilesNumFn(){
	loadFilesNum.innerHTML = '已全部加载，共'+aLi.length+'个'; 
} 
//判断是否全选 
function allActive(){
	checkAll.className = 'active'; 
	checkAll.onOff = false; 
	if(aLi.length>0){
		for (var i =0;i<aLi.length;i++ ) { 
			if(aLi[i].className ==''){
				checkAll.className = ''; 
				checkAll.onOff = true; 
				checkAllText.innerHTML = '全选';
			} 	 
		}
	}else{
		checkAll.className = ''; 
		checkAll.onOff = true; 
		checkAllText.innerHTML = '全选';
	}
}
//导航条显示
function menuBlock(){ 
	menu3.style.display = '';
	for (var i=0;i<aLi.length;i++) {
		if(aLi[i].className == 'active'){
			menu3.style.display = 'block';
		} 
	} 
} 
//btn2列表切换方式
var btn2 = document.getElementsByClassName('btn2')[0]; 
btn2.onOff = false;
btn2.onclick = function(){ 
	if(btn2.onOff){
		btn2.style.background = 'url(img/list_1.png) no-repeat'; 
		oUl.className = 'docu';
		
	}else{
		btn2.style.background = 'url(img/list_1.List.png) no-repeat'; 
		oUl.className = 'docuList';
	}
 	btn2.onOff = !btn2.onOff; 
}
//点击文字菜单中的列表/缩略图
var btn2_list = document.getElementById('btn2_list');
var  btn2_thunmbnail = document.getElementById('btn2_thunmbnail');
btn2_list.onclick = btn2.onclick;
btn2_thunmbnail.onclick = btn2.onclick; 