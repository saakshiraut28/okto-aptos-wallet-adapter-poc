// Inject the inpage script to register the Okto wallet
const script = document.createElement("script");
script.src = chrome.runtime.getURL("dist/inpage.js");
script.type = "module";
script.onload = () => {
  console.log("Okto Wallet inpage script loaded");
  script.remove();
};
script.onerror = (error) => {
  console.error("Failed to load Okto Wallet inpage script:", error);
};

// Insert at the beginning of the document to ensure early loading
(document.head || document.documentElement).appendChild(script);
