console.log(`this is a popup`)

chrome.tabs.query({}, function(tabs) {
    console.log(tabs.title)
})



entrance()