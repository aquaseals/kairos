console.log(`this is a popup`)

let currentTabs =

chrome.tabs.query({}, function(tabs) {
    for (let i=0; i<tabs.length; i++) {
            console.log(tabs[i].title)
            currentTabs.append(tabs[i].title)
    }
    })

chrome.tabs.onCreated.addListener((tab) => {
    currentTabs.append(tab.title)
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

chrome.tabs.on

