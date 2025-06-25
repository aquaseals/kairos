console.log(`this is a popup`)
let tabDropdown;

document.addEventListener("DOMContentLoaded", function(){
    tabDropdown = document.getElementById('tabs')
    chrome.tabs.query({}, function(tabs) {
    for (let i=0; i<tabs.length; i++) {
            currentTabs.push(tabs[i].title)
            currentTabsIds.push(tabs[i].id)
    }
    console.log(currentTabs)
    updateTabList()
    })
    document.getElementById('start').addEventListener('click', function(){
        let selectedIndex = tabDropdown.selectedIndex
        let duration = document.getElementById('length').value
    chrome.runtime.sendMessage({action: "handleBreak", tabId: currentTabsIds[selectedIndex], duration: duration, tabTitle: currentTabs[selectedIndex]})
    })
})

let currentTabs = []
let currentTabsIds = []

function updateTabList() {
    while (tabDropdown.firstChild !== null) {
        tabDropdown.removeChild(tabDropdown.lastChild)
    }
    for (let i=0; i<currentTabs.length; i++) {
        let tab = document.createElement("option")
        tab.innerHTML = currentTabs[i]
        tabDropdown.appendChild(tab)
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.type == 'sendTabUpdate') {
    currentTabs = message.tabs
    currentTabsIds = message.tabIds
    updateTabList()
    }
})