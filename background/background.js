let currentTabs = []
let currentTabsIds = []

function sendTabUpdate() {
    chrome.runtime.sendMessage({type: "sendTabUpdate", tabs: currentTabs, tabIds: currentTabsIds})
}

chrome.tabs.onCreated.addListener((tab) => {
    currentTabs.push(tab.title)
    currentTabsIds.push(tab.id)
    console.log(currentTabs)
    sendTabUpdate()
})

chrome.tabs.onRemoved.addListener(function(tab) {
    for (let i=0; i<currentTabs.length; i++) {
        if(currentTabsId[i] == tab.id) {
            currentTabs.splice(i, 1)
            currentTabsIds.splice(i, 1)
        }
    }
    console.log(currentTabs)
    sendTabUpdate()
})

chrome.tabs.onUpdated.addListener((tabId) => {
    for (let i=0; i<currentTabs.length; i++) {
        if(currentTabsIds[i] == tabId) {
            currentTabs[i] = tab.title
        }
    }
    console.log(currentTabs)
    sendTabUpdate()
})
function handleBreak(duration, tabTitle) {
    console.log(`addevent listener for button wokring`)
    alert(`you want to start a break on ${tabTitle} for ${duration} minutes`)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "handleBreak") {
        if (currentTabsIds.indexOf(request.tabId) > -1) {
            handleBreak(request.duration, request.tabTitle)
        }
    }
})



