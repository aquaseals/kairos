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
function startBreak() {
    let selectedTab = tabDropdown.value
    let selectedTabId = currentTabsIds[currentTabs.indexOf(selectedTab)]
    let breakLength = document.getElementById('length').value
    console.log(`you want to start a break on ${selectedTab} or ${document.getElementById('selected-tab').innerHTML} for ${document.getElementById('length').innerHTML}`)
    chrome.runtime.sendMessage({message: "startBreak", selectedTab: selectedTab, selectedTabId: selectedTabId, duration: breakLength, currentTabs: currentTabs, currentTabsIds: currentTabsIds})
    chrome.tabs.query({active: true}, function(tab){
        chrome.tabs.remove(tab[0].id)
    })
}
document.getElementById('start').addEventListener('click', startBreak)



