import { getAptosWallets, AptosWallet } from "@aptos-labs/wallet-standard";

// Official test implementation following AIP-62 specification
let currentWallets: AptosWallet[] = [];

function updateStatus(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
  }
}

function displayWallets(wallets: AptosWallet[]) {
  const walletList = document.getElementById('wallet-list');
  if (!walletList) return;

  walletList.innerHTML = '';

  if (wallets.length === 0) {
    walletList.innerHTML = `
      <div style="text-align: center; color: #666; padding: 20px;">
        <p>No compliant Aptos wallets found.</p>
        <p><strong>Steps to fix:</strong></p>
        <ol style="text-align: left; max-width: 400px; margin: 0 auto;">
          <li>Install Petra, Okto, or other Aptos wallets</li>
          <li>Ensure they implement all 8 required features</li>
          <li>Refresh this page</li>
        </ol>
      </div>
    `;
    return;
  }

  wallets.forEach(wallet => {
    const walletItem = document.createElement('div');
    walletItem.className = 'wallet-item';
    walletItem.innerHTML = `
      <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-icon" onerror="this.style.display='none'">
      <div class="wallet-info">
        <div class="wallet-name">${wallet.name}</div>
        <div class="wallet-description">Version: ${wallet.version} | Chains: ${wallet.chains?.length || 0} | Features: ${Object.keys(wallet.features).length}</div>
      </div>
    `;

    walletItem.addEventListener('click', () => {
      testWalletConnection(wallet);
    });

    walletList.appendChild(walletItem);
  });
}

async function testWalletConnection(wallet: AptosWallet) {
  updateStatus(`Testing connection to ${wallet.name}...`, 'info');

  try {
    if (wallet.features['aptos:connect']) {
      const result = await wallet.features['aptos:connect'].connect();
      if (result.status === 'Approved') {
        updateStatus(`✅ Successfully connected to ${wallet.name}! Address: ${result.args?.address || 'N/A'}`, 'success');
      } else {
        updateStatus(`❌ Connection to ${wallet.name} was rejected by user.`, 'error');
      }
    } else {
      updateStatus(`❌ ${wallet.name} does not support connection feature.`, 'error');
    }
  } catch (error: any) {
    updateStatus(`❌ Failed to connect to ${wallet.name}: ${error.message}`, 'error');
    console.error('Connection error:', error);
  }
}

// Official AIP-62 implementation
function loadWallets() {
  try {
    // Use official getAptosWallets function as specified in AIP-62
    const { aptosWallets, on } = getAptosWallets();

    currentWallets = aptosWallets;

    console.log(`Found ${aptosWallets.length} AIP-62 compliant wallets`);

    if (aptosWallets.length > 0) {
      updateStatus(`✅ Found ${aptosWallets.length} AIP-62 compliant wallet(s)`, 'success');
      displayWallets(aptosWallets);

      aptosWallets.forEach(wallet => {
        console.log(`- ${wallet.name} v${wallet.version}`);
      });
    } else {
      updateStatus('⚠️ No AIP-62 compliant wallets detected. Install Petra, Okto, or other standard wallets.', 'error');
      displayWallets([]);
    }

    // Set up event listeners as specified in AIP-62
    const removeRegisterListener = on("register", function () {
      console.log('New wallet registered via AIP-62 standard');
      const { aptosWallets: newWallets } = getAptosWallets();
      currentWallets = newWallets;
      updateStatus(`🎉 New wallet registered! Found ${newWallets.length} wallet(s)`, 'success');
      displayWallets(newWallets);
    });

    const removeUnregisterListener = on("unregister", function () {
      console.log('Wallet unregistered via AIP-62 standard');
      const { aptosWallets: remainingWallets } = getAptosWallets();
      currentWallets = remainingWallets;
      updateStatus(`Wallet removed. ${remainingWallets.length} wallet(s) remaining`, 'info');
      displayWallets(remainingWallets);
    });

    // Store unsubscribe functions for cleanup
    (window as any).walletListeners = {
      removeRegisterListener,
      removeUnregisterListener
    };

  } catch (error: any) {
    updateStatus(`❌ Error with AIP-62 detection: ${error.message}`, 'error');
    console.error('AIP-62 detection error:', error);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadWallets();

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      updateStatus('🔄 Refreshing with official AIP-62 detection...', 'info');
      setTimeout(loadWallets, 500);
    });
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  const listeners = (window as any).walletListeners;
  if (listeners) {
    listeners.removeRegisterListener();
    listeners.removeUnregisterListener();
  }
});
