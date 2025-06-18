console.log(`this is a popup`)

let openTabs = chrome.tabs.query({}, function(tabs) {})

function entrance() {
    console.log(openTabs)
}

entrance()