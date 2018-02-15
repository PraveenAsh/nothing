var background = chrome.extension.getBackgroundPage();

function makeCell(data){
	var th = document.createElement('th');
	th.appendChild(document.createTextNode(data));
	return th;
}

function addRow(){
	tr = document.createElement('tr');
	for(i=0;i<arguments.length;++i){
		tr.appendChild(makeCell(arguments[i]));
	}
	return tr;
}


function updateVal(){
	var table = document.getElementById('info');
	table.innerHTML = '';
	table.appendChild(addRow('Domain', 'time(sec)', 'clicks', 'scroll'));
	background.logTime.forEach(function(value, key, map){
		table.appendChild(addRow(key, value/1000, background.logClicks.get(key), background.logScroll.get(key)));
	});
}
chrome.runtime.onMessage.addListener(function(message,sender){
	if(typeof message.data == 'undefined')
		updateVal();
});

//setInterval(background.findUrl,1000);