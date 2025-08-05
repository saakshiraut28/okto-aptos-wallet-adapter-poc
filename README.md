# Okto Aptos Wallet Extension

A Chrome browser extension implementing the Aptos Wallet Standard (AIP-62) for dApp integration.

## Quick Start

### 1. Build & Install

```bash
npm install
npm run build
```

**Load in Chrome:**
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → Select this folder

### 2. Test

```bash
npm test
```

Visit http://localhost:3000 to test wallet detection and connections.

## Features

- ✅ **AIP-62 Compliant** - Implements all 8 required Aptos wallet features
- ✅ **dApp Integration** - Shows up in wallet lists alongside Petra, etc.
- ✅ **Modern UI** - Dark theme with clean interface
- ✅ **Account Management** - Connect/disconnect, copy addresses
- ✅ **Multi-Network** - Devnet/Testnet/Mainnet support

## Project Structure

```
├── manifest.json          # Extension manifest
├── popup.html/css/js       # Wallet UI
├── background.js           # Service worker
├── content-script.js       # Script injection
├── inpage.ts               # Wallet registration
├── standardWallet.ts       # AIP-62 implementation
├── test-dapp.html         # Test page
└── dist/                   # Built files
```

## AIP-62 Implementation

**Required Features (8/8):**
- `aptos:connect` / `aptos:disconnect`
- `aptos:account` / `aptos:network`
- `aptos:signTransaction` / `aptos:signMessage`
- `aptos:onAccountChange` / `aptos:onNetworkChange`

## Development

- `npm run build` - Build extension
- `npm test` - Start test server
- `npm run dev` - Watch mode

## License

MIT
