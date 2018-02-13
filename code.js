var background = chrome.extension.getBackgroundPage();
var text = document.getElementById("urlText");
function updateVal(){
	text.textContent = '';
	background.logTime.forEach(function(value, key, map){
		text.textContent += key+' : '+value/1000+'|';
		console.log(value);
	});
	console.log("updated");
	console.log(background.logTime.size);
}
chrome.runtime.onMessage.addListener(function(message,sender){
	console.log("got message");
	updateVal();
});

setInterval(background.findUrl,1000);