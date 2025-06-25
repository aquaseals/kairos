let currentTabsId;
let currentTabs;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.message == "goFocus"){
            currentTabs = request.currentTabs
            currentTabsIds = request.currentTabsIds
            console.log(currentTabs, currentTabsIds)
        }
    }
)