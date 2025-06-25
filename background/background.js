console.log(`hello from background`)
let seconds;
let timeLeft;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.message == "startBreak"){
            let selectedTab = request.selectedTab
            let selectedTabId = request.selectedTabId
            let duration = request.duration
            seconds = 0
            handleBreak(selectedTab, selectedTabId, duration)
            console.log(`going to handle break`)
        }
    }
)

function handleBreak(selectedTab, selectedTabId, duration) {
    timeLeft = duration*60 // convert mins to seconds
    chrome.tabs.onActivated.addListener(function(activeInfo){
        if(activeInfo.tabId == selectedTabId) {
            startTimer()
            console.log(`starting timer`)
        } else {
            pauseTimer()
        }
    })
    chrome.tabs.onUpdated.addListener((tabId) => {
        if(tabId = selectedTabId) {
            startTimer()
        } else {
            pauseTimer
        }
    })

    if(timeLeft == 0) {
        console.log(`break over get back to work ho`)
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--
        console.log(timeLeft)

        if(timeLeft <= 0){
            clearInterval(timer)
        }
    }, 1000)

}

function pauseTimer() {
    if (timer) {
        clearInterval(timer)
        console.log(`timer paused`)
    }
}



