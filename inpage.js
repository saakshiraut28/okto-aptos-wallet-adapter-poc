import { registerWallet } from "@aptos-labs/wallet-standard";
import { OktoWallet } from "./standardWallet";

(function () {
  if (typeof window === "undefined") return;
  const myWallet = new OktoWallet();
  registerWallet(myWallet);
})();
