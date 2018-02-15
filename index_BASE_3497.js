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
chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab){
	for(site in website.BlockedList){
		if(tab.url.match(site)){
			chrome.tabs.update(tab.Id, {"url" : Object.keys(website.redirect)[0]},function(){});
		}
	}
})
chrome.tabs.onCreated.addListener(function(tab){
	//alert("something");
	for(site in website.BlockedList){
		if(tab.url.match(site)){
			chrome.tabs.update(tab.Id, {"url" : Object.keys(website.redirect)[0]},function(){});
		}
	}
})