console.log(`hello from background`)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.message == "startBreak"){
            let selectedTab = request.selectedTab
            let selectedTabId = request.selectedTabId
            let duration = request.duration
            handleBreak(selectedTab, selectedTabId, duration)
        }
    }
)

function handleBreak(selectedTab, selectedTabId, duration) {
    let tab = chrome.tabs.query({title: selectedTab})
    console.log(`tab is active t/f -> ${tab.active}`)
}