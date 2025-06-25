console.log(`this is a popup`)

let [allTabs] = await chrome.tabs.query()
for(let i; i < allTabs.length; i++) {
    console.log(allTabs[i])
}
