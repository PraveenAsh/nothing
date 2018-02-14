function sendData(event){
	chrome.runtime.sendMessage(null, {'data':event});
}

console.log('im in');
window.onscroll = function(){
	console.log('scrolling');
	sendData('scroll');
}

addEventListener("click", function(){
	console.log('clicked');
	sendData('click');
})

