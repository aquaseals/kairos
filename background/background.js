console.log(`hello from background`)
let timeLeft;
let timer;
let deleteTabId;
let currentTabsIds;
let currentTabs;
let popupWindowId;
let buttonState = false
let focusTabId;
let idOfFocusPopupTab;
let popupAlreadyOpen = false

chrome.tabs.onRemoved.addListener(function(tabId){
    try {
        chrome.tabs.onActivated.removeListener(arguments.callee)
        chrome.tabs.onUpdated.removeListener(arguments.callee)
    } catch (err) {}
    console.log(`tab was closed\n has button been pressed? -> ${buttonState}\n focus popup window id -> ${popupWindowId}\n focus popup tab id -> ${idOfFocusPopupTab}\n going to go to this tab -> ${focusTabId}\n id of closed tab -> ${tabId}`)
    if(buttonState === false && tabId === idOfFocusPopupTab && popupAlreadyOpen === false) {
    chrome.windows.create({focused: true, height: 300, left: 500, top: 500, type:"popup", width: 300}, function(window){
        popupWindowId = window.id
        popupAlreadyOpen = true
        chrome.tabs.create({url: chrome.runtime.getURL('./other/breakEndPopup.html')}, function(tab){
        idOfFocusPopupTab = tab.id
        chrome.tabs.onUpdated.addListener(function listener(tabId, info){ // make sure popup window loaded
                if(tabId === tab.id && info.status == "complete") {
                    chrome.tabs.onUpdated.removeListener(listener)
                    chrome.tabs.sendMessage(tab.id, {message: "goFocus", currentTabs: currentTabs, currentTabsIds: currentTabsIds, window: window}) //send msg to 2nd popup
                }
            })
        })
    })
    }
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.message == "startBreak"){
            let selectedTab = request.selectedTab
            let selectedTabId = request.selectedTabId
            let duration = request.duration
            currentTabs = request.currentTabs
            currentTabsIds = request.currentTabsIds
            handleBreak(selectedTab, selectedTabId, duration)
            console.log(`going to handle break`)
        }
        if(request.message == "buttonPressed") {
            buttonState = true
            focusTabId = request.focusTabId
            popupWindowId = request.windowId
            console.log(`focus button pressed\n has button been pressed? -> ${buttonState}\n focus popup id -> ${popupWindowId}\n going to go to this tab -> ${focusTabId}`)

        } else if (request.message == "popupOpened") {
            popupWindowId = request.windowId
            buttonState = false
            focusTabId = request.focusTabId
            console.log(`focus popup opened\n has button been pressed? -> ${buttonState}\n focus popup id -> ${popupWindowId}\n going to go to this tab -> ${focusTabId}`)
        }
    }
)

function closeTab(deleteTabId) {
    console.log(`in close tab func, is popup tab already open? -> ${popupAlreadyOpen}`)
    if (popupAlreadyOpen) return

    popupAlreadyOpen = true
    endTimer()

    chrome.tabs.onActivated.removeListener(arguments.callee)
    chrome.tabs.onUpdated.removeListener(arguments.callee)
    chrome.windows.create({focused: true, height: 300, left: 500, top: 500, type:"popup", width: 300}, function(window){
        popupWindowId = window.id // create 2nd popup window
        chrome.tabs.create({url: chrome.runtime.getURL('./other/breakEndPopup.html')}, function(tab){ // load popup html in new tab
            chrome.tabs.onUpdated.addListener(function listener(tabId, info){ // make sure popup window loaded
                if(tabId === tab.id && info.status == "complete") {
                    chrome.tabs.onUpdated.removeListener(listener)
                    let i = currentTabsIds.indexOf(deleteTabId)
                    currentTabs.splice(i, 1)
                    currentTabsIds.splice(i, 1)
                    idOfFocusPopupTab = tab.id
                    console.log(currentTabs)
                    chrome.tabs.sendMessage(tab.id, {message: "goFocus", currentTabs: currentTabs, currentTabsIds: currentTabsIds, window: window}) //send msg to 2nd popup
                }
            })
        })
    })
    chrome.tabs.remove(deleteTabId)
    popupAlreadyOpen = false

}

    /* 
    
    , function(response){
                    let buttonState = response.buttonState
                    let focusPopup = response.focusPopupId
                    
            })
                    

    */


function handleBreak(selectedTab, selectedTabId, duration) {
    try {
        chrome.tabs.onActivated.removeListener(arguments.callee)
        chrome.tabs.onUpdated.removeListener(arguments.callee)
    } catch (err) {}
    timeLeft = duration*60 // convert mins to seconds
    deleteTabId = selectedTabId

    if(timer == 1) {
        console.log(`continuing old timer`)
        return
    } else {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tab){ 
        if(tab[0].id == selectedTabId && timeLeft > 0) {
            startTimer()
            console.log(`starting timer in query`)
        } else {
            pauseTimer()
            console.log(`pausing timer in query`)
        }
    })
    chrome.tabs.onActivated.addListener(function (activeInfo){
        if(activeInfo.tabId == selectedTabId && timeLeft > 0) {
            startTimer()
            console.log(`starting timer in activated`)
        } else {
            pauseTimer()
            console.log(`pausing timer in activated`)
        }
    })
    chrome.tabs.onUpdated.addListener(function (tabId) {
        if(tabId == selectedTabId && timeLeft > 0 && tabId != deleteTabId) {
            startTimer()
            console.log(`starting timer in updated`)
        } else {
            pauseTimer()
            console.log(`pausing timer in updated`)

        }
    })
    }
}

function startTimer() {
    if (timer == 1) return
    
    timer = setInterval(() => {
        timeLeft--
        console.log(timeLeft)

        if(timeLeft <= 0){
            clearInterval(timer)
            closeTab(deleteTabId)
        }
    }, 1000)

}

function pauseTimer() {
    if (timer === 0) return
    try {
        clearInterval(timer)
        console.log(`timer paused`)
    } catch (err) {
        console.log(`no timer to pause`)
    }
}

function endTimer() {
    clearInterval(timer)
    try {
        chrome.tabs.onActivated.removeListener(arguments.callee)
        chrome.tabs.onUpdated.removeListener(arguments.callee)
    } catch (err) {}
}



