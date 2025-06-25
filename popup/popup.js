console.log(`this is a popup`)

let currentTabs = []
let currentTabsIds = []
let tabDropdown;

function updateTabList() {
    tabDropdown = document.getElementById('tabs')
    while (tabDropdown.firstChild !== null) {
        tabDropdown.removeChild(tabDropdown.lastChild)
    }
    for (let i=0; i<currentTabs.length; i++) {
        let tab = document.createElement("option")
        tab.innerHTML = currentTabs[i]
        tabDropdown.appendChild(tab)
    }
}

chrome.tabs.query({}, function(tabs) {
    for (let i=0; i<tabs.length; i++) {
            currentTabs.push(tabs[i].title)
            currentTabsIds.push(tabs[i].id)
    }
    console.log(currentTabs)
    updateTabList()
    })

chrome.tabs.onCreated.addListener((tab) => {
    currentTabs.push(tab.title)
    currentTabsIds.push(tab.id)
    console.log(currentTabs)
    updateTabList()
})

chrome.tabs.onRemoved.addListener(function(tabId) {
    for (let i=0; i<currentTabs.length; i++) {
        if(currentTabsId[i] == tabId) {
            currentTabs.splice(i, 1)
            currentTabsIds.splice(i, 1)
        }
    }
    console.log(currentTabs)
    updateTabList()
})

chrome.tabs.onUpdated.addListener((tab) => {
    for (let i=0; i<currentTabs.length; i++) {
        if(currentTabsIds[i] == tab.id) {
            currentTabs[i] = tab.title
        }
    }
    console.log(currentTabs)
    updateTabList()
})
function handleBreak() {
    let selectedTab = tabDropdown.value
    console.log(`addevent listener for button wokring`)
    alert(`you want to start a break on ${selectedTab} or ${document.getElementById('selected-tab').innerHTML} for ${document.getElementById('length').innerHTML}`)
}
document.getElementById('start').addEventListener('click', handleBreak)



