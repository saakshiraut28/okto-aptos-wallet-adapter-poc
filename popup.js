/** @format */

// Popup JavaScript - separated from HTML to comply with CSP

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const action = urlParams.get("action");
const type = urlParams.get("type");

// DOM elements
let mainView, connectView, signView, status, accountInfo, connectBtn;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  mainView = document.getElementById("main-view");
  connectView = document.getElementById("connect-view");
  signView = document.getElementById("sign-view");
  status = document.getElementById("status");
  accountInfo = document.getElementById("account-info");
  connectBtn = document.getElementById("connect-btn");

  // Initialize based on action
  if (action === "connect") {
    showConnectView();
  } else if (action === "sign") {
    showSignView(type);
  } else {
    showMainView();
  }

  // Add event listeners
  setupEventListeners();
});

function showMainView() {
  mainView.style.display = "block";
  connectView.style.display = "none";
  signView.style.display = "none";

  // Check connection status
  checkConnectionStatus();
}

function showConnectView() {
  mainView.style.display = "none";
  connectView.style.display = "block";
  signView.style.display = "none";
}

function showSignView(signType) {
  mainView.style.display = "none";
  connectView.style.display = "none";
  signView.style.display = "block";

  const signMessage = document.getElementById("sign-message");
  if (signMessage) {
    signMessage.textContent = `Approve this ${signType || "transaction"
      } signature request.`;
  }
}

async function checkConnectionStatus() {
  try {
    const result = await chrome.storage.local.get(["currentAccount"]);
    if (result.currentAccount) {
      updateUI(true, result.currentAccount);
    } else {
      updateUI(false);
    }
  } catch (error) {
    console.error("Failed to check connection status:", error);
    updateUI(false);
  }
}

function updateUI(connected, account = null) {
  if (connected && account) {
    status.className = "status connected";
    status.innerHTML = "<div>Connected</div>";
    accountInfo.style.display = "block";

    const addressElement = document.getElementById("address");
    if (addressElement) {
      addressElement.textContent = account.address;
    }

    connectBtn.textContent = "Disconnect";
  } else {
    status.className = "status disconnected";
    status.innerHTML = "<div>Not Connected</div>";
    accountInfo.style.display = "none";
    connectBtn.textContent = "Connect Wallet";
  }
}

function setupEventListeners() {
  // Connect/Disconnect button
  connectBtn.addEventListener("click", handleConnectClick);

  // Connect view buttons
  const approveConnectBtn = document.getElementById("approve-connect");
  const rejectConnectBtn = document.getElementById("reject-connect");

  if (approveConnectBtn) {
    approveConnectBtn.addEventListener("click", handleApproveConnect);
  }

  if (rejectConnectBtn) {
    rejectConnectBtn.addEventListener("click", handleRejectConnect);
  }

  // Sign view buttons
  const approveSignBtn = document.getElementById("approve-sign");
  const rejectSignBtn = document.getElementById("reject-sign");

  if (approveSignBtn) {
    approveSignBtn.addEventListener("click", handleApproveSign);
  }

  if (rejectSignBtn) {
    rejectSignBtn.addEventListener("click", handleRejectSign);
  }

  // Settings button
  const settingsBtn = document.getElementById("settings-btn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", handleSettingsClick);
  }

  // Copy address button
  const copyAddressBtn = document.getElementById("copy-address");
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener("click", handleCopyAddress);
  }
}

async function handleConnectClick() {
  if (connectBtn.textContent === "Connect Wallet") {
    try {
      // Create a mock account for demo
      const account = {
        address:
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join(""),
        publicKey:
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join(""),
        privateKey:
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join(""),
      };

      await chrome.storage.local.set({ currentAccount: account });
      updateUI(true, account);

      // Show success message
      showNotification("Wallet connected successfully!", "success");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      showNotification("Failed to connect wallet", "error");
    }
  } else {
    try {
      await chrome.storage.local.remove(["currentAccount"]);
      updateUI(false);
      showNotification("Wallet disconnected", "info");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  }
}

function handleApproveConnect() {
  chrome.storage.local.get(["currentAccount"]).then((result) => {
    chrome.runtime.sendMessage({
      type: "wallet_connect_result",
      approved: true,
      account: result.currentAccount,
    });
    window.close();
  });
}

function handleRejectConnect() {
  chrome.runtime.sendMessage({
    type: "wallet_connect_result",
    approved: false,
  });
  window.close();
}

function handleApproveSign() {
  // In a real implementation, this would approve the signature request
  console.log("Signature approved");
  window.close();
}

function handleRejectSign() {
  // In a real implementation, this would reject the signature request
  console.log("Signature rejected");
  window.close();
}

function handleSettingsClick() {
  // Open settings view or new tab
  console.log("Settings clicked");
  // You could implement a settings page here
}

async function handleCopyAddress() {
  try {
    const result = await chrome.storage.local.get(["currentAccount"]);
    if (result.currentAccount && result.currentAccount.address) {
      await navigator.clipboard.writeText(result.currentAccount.address);

      // Update button text temporarily to show success
      const copyBtn = document.getElementById("copy-address");
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "✓";
      copyBtn.style.background = "rgba(0, 212, 170, 0.3)";

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = "rgba(255, 255, 255, 0.1)";
      }, 1000);

      showNotification("Address copied to clipboard!", "success");
    }
  } catch (error) {
    console.error("Failed to copy address:", error);
    showNotification("Failed to copy address", "error");
  }
}

function showNotification(message, type = "info") {
  // Create a simple notification
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 10px 15px;
        border-radius: 6px;
        color: white;
        font-size: 12px;
        z-index: 1000;
        transition: opacity 0.3s;
    `;

  switch (type) {
    case "success":
      notification.style.background = "#00D4AA";
      break;
    case "error":
      notification.style.background = "#FF6B6B";
      break;
    default:
      notification.style.background = "#667eea";
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}
