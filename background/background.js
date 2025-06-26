console.log(`hello from background`)
let seconds;
let timeLeft;
let deleteTabId;
let currentTabsIds;
let currentTabs;
let popupWindowId;
let buttonState = false
let focusTabId;

chrome.tabs.onRemoved.addListener(function(tabId){
    chrome.tabs.onActivated.removeListener(arguments.callee)
    chrome.tabs.onUpdated.removeListener(arguments.callee)
    console.log(`tab was closed\n has button been pressed? -> ${buttonState}\n focus popup id -> ${popupWindowId}\n going to go to this tab -> ${focusTabId}\n id of closed tab -> ${tabId}`)
    if(buttonState == false && tabId == popupWindowId) {
    chrome.windows.create({focused: true, height: 300, left: 500, top: 500, type:"popup", width: 300}, function(){
        chrome.tabs.create({url: chrome.runtime.getURL('./other/breakEndPopup.html')})
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
            seconds = 0
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
    chrome.tabs.onActivated.removeListener(arguments.callee)
    chrome.tabs.onUpdated.removeListener(arguments.callee)
    chrome.windows.create({focused: true, height: 300, left: 500, top: 500, type:"popup", width: 300}, function(window){ // create 2nd popup window
        chrome.tabs.create({url: chrome.runtime.getURL('./other/breakEndPopup.html')}, function(tab){ // load popup html in new tab
            chrome.tabs.onUpdated.addListener(function listener(tabId, inof){ // make sure popup window loaded
                if(tabId === tab.id && inof.status == "complete") {
                    chrome.tabs.onUpdated.removeListener(listener)
                    let i = currentTabsIds.indexOf(deleteTabId)
                    currentTabs.splice(i, 1)
                    currentTabsIds.splice(i, 1)
                    console.log(currentTabs)
                    chrome.tabs.sendMessage(tab.id, {message: "goFocus", currentTabs: currentTabs, currentTabsIds: currentTabsIds, window: window}) //send msg to 2nd popup
                }
            })
        })
    })
    chrome.tabs.remove(deleteTabId)}

    /* 
    
    , function(response){
                    let buttonState = response.buttonState
                    let focusPopup = response.focusPopupId
                    
            })
                    

    */


function handleBreak(selectedTab, selectedTabId, duration) {
    timeLeft = duration*60 // convert mins to seconds
    deleteTabId = selectedTabId
    chrome.tabs.query({active: true}, function(tab){ // not working -> should start timer if on the correct tab
        if(tab[0].id == selectedTabId && timeLeft > 0) {
            startTimer()
            console.log(`starting timer`)
        } else {
            pauseTimer()
        }
    })
    chrome.tabs.onActivated.addListener(function(activeInfo){
        if(activeInfo.tabId == selectedTabId && timeLeft > 0) {
            startTimer()
            console.log(`starting timer`)
        } else {
            pauseTimer()
        }
    })
    chrome.tabs.onUpdated.addListener((tabId) => {
        if(tabId == selectedTabId && timeLeft > 0) {
            startTimer()
        } else {
            pauseTimer
        }
    })
}

function startTimer() {
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
    try {
        clearInterval(timer)
        console.log(`timer paused`)
    } catch (err) {
        console.log(`no timer to pause`)
    }
}



