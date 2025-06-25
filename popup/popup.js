console.log(`this is a popup`)

chrome.tabs.query({}, function(tabs) {
    console.log(tabs)
})

function entrance() {
    console.log(openTabs)
}

entrance()