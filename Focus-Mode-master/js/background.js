
(function(){

  var storage = chrome.storage;

  /* Load the websites to block and pass it to the callback */
  function loadWebsites(callback){
    /* Set or get the websites to block */
    var websites;

    storage.local.get(["defaultWebsites", "customWebsites"], function(items){
      //First, load the default websites to block
      if(items.defaultWebsites === undefined){
        websites =
        [
          {"url" : "facebook.com", "on" : true},
          {"url" : "twitter.com", "on" : true},
          {"url" : "linkedin.com", "on" : true},
          {"url" : "instagram.com", "on" : true},
          {"url" : "youtube.com", "on" : true},
          {"url" : "dailymotion.com", "on" : true},
          {"url" : "flickr.com", "on" : true},
        ];

        storage.local.set({"defaultWebsites": websites});
      }
      else {
        websites = items.defaultWebsites;
      }

      //Then load the customs websites to block
      if(items.customWebsites === undefined){
        storage.local.set({"customWebsites": []});
      }
      else {
        websites = websites.concat(items.customWebsites);
      }

      //Call the callback and pass the resulting array
      if(typeof callback === "function"){
        callback(websites);
      }
    });
  }

  /* Check if the url contains words from the keywords array */
  function urlContains(url, keywords){
    var result = false;

    for(var index in keywords){
      if(keywords[index].on && url.indexOf(keywords[index].url) != -1){
        result = true;
        break;
      }
    }

    return result;
  }

  /* Redirect if necessary */
  function analyzeUrl(details){
    storage.local.get("on", function(item){
      if(item.on === true){

        loadWebsites(function(websites){
          /* FrameId test to be sure that the navigation event doesn't come from a subframe */
          if(details.frameId === 0 && urlContains(details.url, websites)){
            var id = details.tabId;

            chrome.tabs.update(id, {"url": "html/message.html"});

            /* update the number of blocked attempts */
            storage.local.get("blocked", function(item){
              storage.local.set({"blocked": item.blocked+1});
              console.log(item);
            });
          }
        });
      }
    });
  }

  /* Attach event callback */
  chrome.webNavigation.onCommitted.addListener(analyzeUrl);

  storage.local.get("on", function(item){
    if(item.on === undefined){
      /* deactivated by default & set the number of blocked attempts*/
      storage.local.set({"on": false, "blocked": 0});
    }
  });

  /* Load on start */
  loadWebsites();
})();
