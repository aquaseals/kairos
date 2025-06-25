console.log(`this is a popup`)

let currentTabs = []

function updateTabList() {
    let tabDropdown = document.getElementById('tabs')
    tabDropdown.innerHTML = ''
    for (let i=0; i<currentTabs.length; i++) {
        let tab = document.createElement("option")
        tab.innerHTML = currentTabs[i]
        tabDropdown.appendChild(tab)
    }
}

chrome.tabs.query({}, function(tabs) {
    for (let i=0; i<tabs.length; i++) {
            currentTabs.push(tabs[i].title)
    }
    console.log(currentTabs)
    updateTabList()
    })

chrome.tabs.onCreated.addListener((tab) => {
    currentTabs.push(tab.title)
    console.log(currentTabs)
    updateTabList()
})

chrome.tabs.onRemoved.addListener((tab) => {
    for (let i=0; i<currentTabs.length; i++) {
        if(currentTabs[i] == tab.title) {
            currentTabs.splice(i, 1)
        }
    }
    console.log(currentTabs)
    updateTabList()
})

chrome.tabs.onUpdated.addListener((tab) => {
    for (let i=0; i<currentTabs.length; i++) {
        if(currentTabs[i].id == tab.id) {
            currentTabs[i] = tab.title
        }
    }
    console.log(currentTabs)
    updateTabList()
})



