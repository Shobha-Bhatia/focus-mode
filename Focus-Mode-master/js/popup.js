
(function(){
  var storage = chrome.storage;

  /* Update the value of the button */
  function updateOnButton(){
    var onButton = document.getElementById("onButton");

    storage.local.get("on", function(item){
      if(item.on === true){
        onButton.innerText = "Deactivate";
      }
      else {
        onButton.innerText = "Activate";
      }
    });
  }

  /* Update icon to show the extension state */
  function updateIcon(){
    storage.local.get("on", function(item){
      if(item.on === true){
        chrome.browserAction.setIcon({"path": "../images/icon128-2.png"});
      }
      else {
        chrome.browserAction.setIcon({"path": "../images/icon128-1.png"});
      }
    });
  }

  /* Activate or Deactivate the work mode */
  function onButtonClick(){
    storage.local.get(["on", "blocked"], function(item){
      console.log(item.on);
      var on;

      if(item.on === undefined || item.on === false){
        on = true;
      }
      else {
        on = false;
      }

      storage.local.set({"on": on, "blocked": 0});

      updateOnButton();
      updateIcon();
    });
  }

  /* Open the options tab */
  function optionsButtonClick(){
    chrome.tabs.create({"url": "html/settings.html"});
  }

  /* update the number of attempts */
  function updateAttempts(){
    var nbAttempts = 0;

    storage.local.get("blocked", function(item){
      if(item.blocked !== undefined){
        nbAttempts = item.blocked;
      }

      var number = document.getElementsByTagName("number")[0];
      number.innerText = nbAttempts;
    });
  }

  //Update on each popup openning
  updateAttempts();
  updateOnButton();
  updateIcon();

  /* Attach onclick functions */
  var onButton = document.getElementById("onButton");
  var optionsButton = document.getElementById("optionsButton");

  onButton.addEventListener("click", onButtonClick);
  optionsButton.addEventListener("click", optionsButtonClick);
})();
