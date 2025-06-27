let currentTabsIds;
let currentTabs;
let focusPopup;
let windowId
let focusTab;
let focusTabId;
let tabDropdown;

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        if(request.message == "goFocus"){
            currentTabs = request.currentTabs
            currentTabsIds = request.currentTabsIds
            windowId = request.window.id
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
                console.log(`focused button pressed`)
                focusTab = tabDropdown.value
                let focusTabIndex = currentTabs.indexOf(focusTab)
                focusTabId = currentTabsIds[focusTabIndex]
                chrome.runtime.sendMessage({message: "buttonPressed", windowId: windowId, focusTabId: focusTabId})
                console.log(focusTab, windowId, focusTabId, focusTabIndex)
                chrome.tabs.update(focusTabId, {active: true})
                chrome.windows.remove(windowId)
                window.close()
            })

            chrome.runtime.sendMessage({message: "popupOpened", windowId: windowId, focusTabId: focusTabId})
        }
    }
)
