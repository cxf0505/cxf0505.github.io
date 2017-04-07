var head_nav = document.getElementById('head_nav');
var as = head_nav.getElementsByTagName('a');
var span = head_nav.getElementsByTagName('span'); 
//头部js
span[0].style.border = '2px solid #fff';
for (var i=0;i<as.length;i++) {
	as[i].index = i;
	as[i].onclick = function(){ 
		for (var i=0;i<span.length;i++) {
			span[i].style.border = '';
		}
		span[this.index].style.border = '2px solid #fff';
	}
}   
