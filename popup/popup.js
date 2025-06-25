console.log(`this is a popup`)

let [allTabs] = chrome.tabs.query()
for(let i; i < allTabs.length; i++) {
    console.log(allTabs[i])
}
