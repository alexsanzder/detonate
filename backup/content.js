/* global chrome */
// Lisent message in content:
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse({ message: "hi to you" });
});

// If you want to sendMessage from any popup or content script,
// use `chrome.runtime.sendMessage()`.
// Send message to background:
chrome.runtime.sendMessage(
  { mesage: "Send message to background from content" },
  function(response) {
    console.log(
      `Message response from background in content: ${JSON.stringify(response)}`
    );
  }
);
