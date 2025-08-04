chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openConnectPopup") {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html?action=connect"),
      type: "popup",
      width: 400,
      height: 600
    });
  }
});
