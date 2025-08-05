import { registerWallet } from "@aptos-labs/wallet-standard";
import { OktoWallet } from "./standardWallet";

// Ensure this runs when the page loads
(function () {
  if (typeof window === "undefined") return;

  // Prevent multiple registrations
  if ((window as any).oktoWalletRegistered) {
    return;
  }

  try {
    // Create and register the Okto wallet
    const oktoWallet = new OktoWallet();

    // Register with the standard wallet registry
    registerWallet(oktoWallet);

    // Mark as registered to prevent duplicates
    (window as any).oktoWalletRegistered = true;

    console.log("✅ Okto Wallet registered successfully");

  } catch (error) {
    console.error("❌ Failed to register Okto Wallet:", error);
  }
})();
