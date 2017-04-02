chrome.tabs.onActivated.addListener(function(e) {
    chrome.tabs.executeScript(tabs[0].id, {file: "content_script.js"});
});