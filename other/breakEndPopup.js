let currentTabsId;
let currentTabs;
let focusPopup;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.message == "goFocus"){
            currentTabs = request.currentTabs
            currentTabsIds = request.currentTabsIds
            focusPopup = chrome.tabs.query({active: true, title: "Focus time!"})
            console.log(focusPopup)
            console.log(currentTabs, currentTabsIds)
            let tabDropdown = document.getElementById('tabs')
            for (let i=0; i<currentTabs.length; i++) {
            let tab = document.createElement("option")
            tab.innerHTML = currentTabs[i]
            tabDropdown.appendChild(tab)
             }

            /*document.getElementById("focus").addEventListener('click', function())

            chrome.tabs.onRemoved.addListener(function(tabId){
                if(tabId == focusPopup) {
                    chrome.windows.create({focused: true, height: 300, left: 500, top: 500, type:"popup", width: 300}, function(){
                        chrome.tabs.create({url: chrome.runtime.getURL('./other/breakEndPopup.html')})
                    })
                }
            })*/
        }
    }
)

/*

chrome.windows.create({focused: true, height: 300, left: 500, top: 500, type:"popup", width: 300}, function(){ // create 2nd popup window
        chrome.tabs.create({url: chrome.runtime.getURL('./other/breakEndPopup.html')}, function(tab){ // load popup html in new tab
            chrome.tabs.onUpdated.addListener(function listener(tabId, inof){ // make sure popup window loaded
                if(tabId === tab.id && inof.status == "complete") {
                    chrome.tabs.onUpdated.removeListener(listener)
                    chrome.tabs.sendMessage(tab.id, {message: "goFocus", currentTabs: currentTabs, currentTabsIds: currentTabsIds}) //send msg to 2nd popup

                }
            })
        })
    })

*/