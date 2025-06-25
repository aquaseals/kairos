console.log(`hello from background`)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.message == "startBreak"){
            console.log(request.selectedTab, request.selectedTabId)
        }
    }
)