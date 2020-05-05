// Lisent message in popup:
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "hi") sendResponse({ message: "hi to you" });
});

// If you want to sendMessage from any popup or content script,
// use `chrome.runtime.sendMessage()`.
// Send message to background:
chrome.runtime.sendMessage(
  { mesage: "Send message to background from popup" },
  response => {
    console.log(
      `message from response in popup from background: ${JSON.stringify(
        response
      )}`
    );
  }
);

// If you want to sendMessage from tab of browser,
// use `chrome.tabs.sendMessage()`.
// Send message from active tab to background:
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, { message: "hello" }, response => {
    console.log(
      `message response from ? to bakground: ${JSON.stringify(response)}`
    );
  });
});
