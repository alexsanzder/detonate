/* global chrome gapi */
(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
  });

  chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { token: "tok" }, response => {
        console.log(response);
      });
    });
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { message: "hello" }, response => {
          console.log(
            `message response from ? to bakground: ${JSON.stringify(response)}`
          );
        });
      });
    }
  });
})();
