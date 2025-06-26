let currentTabsIds;
let currentTabs;
let focusPopup;
let windowInfo
let focusTab;
let focusTabId;
let buttonState = false;
let tabDropdown;

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        if(request.message == "goFocus"){
            currentTabs = request.currentTabs
            currentTabsIds = request.currentTabsIds
            windowInfo = request.window
            let focuPopupTab = await new Promise((resolve) => {
                chrome.tabs.query({active: true, title: "Focus time!"}, function(tab){
                resolve(tab[0])
            })
            })
            focusPopup = focuPopupTab?.id
            console.log(focusPopup)
            console.log(currentTabs, currentTabsIds)

            // updating dropdown w latest tabs
            tabDropdown = document.getElementById('tabs')
            for (let i=0; i<currentTabs.length; i++) {
            let tab = document.createElement("option")
            tab.innerHTML = currentTabs[i]
            tab.value = currentTabs[i]
            tabDropdown.appendChild(tab)
             }

            document.getElementById("focus").addEventListener('click', function(){
                buttonState = true
                let focusTab = tabDropdown.value
                let focusTabIndex = currentTabs.indexOf(focusTab)
                let focusTabId = currentTabsIds[focusTabIndex]
                console.log(focusTab, windowInfo.id, focusTabId, focusTabIndex)
                chrome.tabs.update(focusTabId, {active: true})
                chrome.runtime.sendMessage({message: "buttonPressed"})
                chrome.windows.remove(windowInfo.id)
            })

            chrome.runtime.sendMessage({message: "popupOpened", windowId: windowInfo.id, focusTabId: focusTabId})
        }
        return true
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