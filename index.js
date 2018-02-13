console.log("something");
var website = {};
var storage = function(){
	website.BlockedList = {
		"facebook.com"	: "Facebook",
		"youtube.com"	: "Youtube",
		"twitter.com"	: "Twitter",
		"instagram.com"	: "Instagram" 
	};
	if(!website.BlockedList){
		chrome.storage.sync.set(website.BlockedList,function(){
			message("BlockedList is set");
		})
	}
}
//function call
storage();

//Function to redirect social media
website.redirect = {
	"redirect.html" : "Access controlled!"
}

function updateVal(){
	console.log("active url is "+activeUrl);
	chrome.runtime.sendMessage(null,{"message":"hi"});
}
activeUrl = null;
logTime = new Map;
oldDate = Date.now();
curDate = null;
oldUrl = null;
var r = /:\/\/(.[^/]+)/;

function findUrl(){
	console.log("inside fucntion findUrl");
	chrome.tabs.query({'currentWindow':true, 'active': true}, function(tabs) {
  		activeUrl = tabs[0].url.match(r)[1];
  		if(oldUrl != null){
  			curDate = Date.now();
  			logTime.set(oldUrl, logTime.get(oldUrl) + (curDate - oldDate));
  			oldDate = curDate;
  		}
  		if(logTime.has(activeUrl)){
  			oldUrl = activeUrl;
  		}
  		else if(logTime.size < 5){
  			logTime.set(activeUrl, 0);
  			oldUrl = activeUrl;
  		}
  		updateVal();
	});
}


chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab){
	for(site in website.BlockedList){
		if(tab.url.match(site)){
			chrome.tabs.update(tab.Id, {"url" : Object.keys(website.redirect)[0]},function(){});
		}
	}
	findUrl();
})
chrome.tabs.onActivated.addListener(function (activeInfo){
	findUrl();
});
chrome.tabs.onCreated.addListener(function(tab){
	//alert("something");
	for(site in website.BlockedList){
		if(tab.url.match(site)){
			chrome.tabs.update(tab.Id, {"url" : Object.keys(website.redirect)[0]},function(){});
		}
	}
})