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
logClicks = new Map;
logScroll = new Map;
logTime.set('misc', 0);
logTime.set('idle', 0);
logClicks.set('misc', 0);
logClicks.set('idle', 0);
logScroll.set('misc', 0);
logScroll.set('idle', 0);
logSize = 10;
oldDate = Date.now();
curDate = null;
oldUrl = 'idle';
isFocused = true;
var r = /:\/\/(.[^/]+)/;

function findUrl(){
	//console.log("inside fucntion findUrl");
	chrome.tabs.query({'currentWindow':true, 'active': true}, function(tabs) {
      if(tabs.length == 0 || !isFocused){
        activeUrl = 'idle';
      }
      else{
  		  activeUrl = tabs[0].url.match(r)[1]; 
      }
      curDate = Date.now();
      if(logTime.has(oldUrl))
        logTime.set(oldUrl, logTime.get(oldUrl) + curDate - oldDate);
      oldDate = curDate;
      oldUrl = activeUrl;
      if(logTime.size < logSize && !logTime.has(activeUrl)){
        logTime.set(activeUrl, 0);
        logClicks.set(activeUrl, 0);
        logScroll.set(activeUrl, 0);
      }

  		updateVal();
	});
}
function checkBrowserFocus(){
    chrome.windows.getCurrent(function(browser){
      isFocused = browser.focused;
    })
}

setInterval(findUrl,1000);
setInterval(checkBrowserFocus,1000);


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

chrome.runtime.onMessage.addListener(function(message, sender){
  //console.log(message.data);
  //console.log(sender.url);
  givenUrl = sender.url.match(r)[1];
  if(logTime.has(givenUrl))
  if(message.data == 'click'){
    logClicks.set(givenUrl, logClicks.get(givenUrl) + 1);
  }
  else{
    logScroll.set(givenUrl, logScroll.get(givenUrl) + 1);
  }
  console.log(givenUrl+'clicks = '+logClicks.get(givenUrl)+' scorll = '+logScroll.get(givenUrl));
})