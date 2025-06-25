console.log(`hello from background`)
let seconds;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.message == "startBreak"){
            let selectedTab = request.selectedTab
            let selectedTabId = request.selectedTabId
            let duration = request.duration
            seconds = 0
            handleBreak(selectedTab, selectedTabId, duration)
        }
    }
)

function timer(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function handleBreak(selectedTab, selectedTabId, duration) {
    chrome.tabs.onActivated.addListener(function(activeInfo){
        if(activeInfo.tabId == selectedTabId) {
            console.log(`timer starting`)
            for(let i; i<duration*60; i++) {
                seconds++
                timer(1000)
            }
            console.log(`break over back to work ho`)
        }
            /*if(seconds/60 == duration) {
                clearInterval(breakTimer)
                console.log(`break over back to work ho`)
            }
        } else {
            clearInterval(breakTimer)
            console.log(`switch to your break tab to continue break`)
        }*/
    })
}