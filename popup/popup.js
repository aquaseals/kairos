console.log(`this is a popup`)

let currentTabs = []

chrome.tabs.query({}, function(tabs) {
    for (let i=0; i<tabs.length; i++) {
            currentTabs.push(tabs[i].title)
    }
    console.log(currentTabs)
    })

chrome.tabs.onCreated.addListener((tab) => {
    currentTabs.push(tab.title)
    console.log(currentTabs)
})

chrome.tabs.onRemoved.addListener((tab) => {
    for (let i=0; i<currentTabs.length; i++) {
        if(currentTabs[i] == tab.title) {
            currentTabs.splice(i, 1)
        }
    }
    console.log(currentTabs)
})

chrome.tabs.onUpdated.addListener((tab) => {
    for (let i=0; i<currentTabs.length; i++) {
        if(currentTabs[i].id == tab.id) {
            currentTabs[i] = tab.title
        }
    }
    console.log(currentTabs)
})

chrome.tabs.on

