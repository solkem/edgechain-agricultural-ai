# Lace Midnight Wallet Integration Guide

## Overview

EdgeChain is now integrated with the **Lace Midnight Preview** wallet, enabling real privacy-preserving blockchain interactions for agricultural data collaboration.

## Prerequisites

### 1. Install Lace Wallet

**Chrome/Brave/Edge:**
1. Visit [https://www.lace.io/midnight](https://www.lace.io/midnight)
2. Download the Lace Midnight Preview browser extension
3. Follow the installation instructions
4. Create a new wallet or import an existing one
5. **Important**: Make sure you're on the Midnight testnet (devnet)

### 2. Get Test Tokens

To interact with the EdgeChain smart contracts, you'll need test tokens (tDUST):
1. Open your Lace wallet
2. Copy your Midnight address (Bech32m format)
3. Visit the Midnight testnet faucet (link TBD from Midnight docs)
4. Request test tokens

## How It Works

### Wallet Detection

The app automatically detects the Lace Midnight wallet through two injection points:
- **Primary**: `window.midnight.lace`
- **Fallback**: `window.cardano.midnight` (older versions)

### Connection Flow

1. **User clicks "Connect Wallet"**
2. App checks if Lace is installed
3. Calls `provider.enable()` - prompts user for approval
4. Wallet returns state with:
   - `coinPublicKey`: Your Midnight address
   - `balanceTDust`: Your tDUST balance
   - `shieldedPublicKey`: For private transactions
   - Additional keys for legacy/shielded operations

5. App displays wallet info and loads on-chain data

### Wallet State Structure

```javascript
{
  coinPublicKey: "midnight1abc...", // Your Midnight address (Bech32m)
  balanceTDust: 1000000,            // Balance in smallest unit
  shieldedPublicKey: "...",          // For ZK transactions
  shieldedCoinPublicKey: "...",      // Shielded CPK
  shieldedEncryptionPublicKey: "...", // Shielded EPK
  legacyAddress: "...",              // Legacy format (deprecated)
}
```

## Using the Integration

### Basic Wallet Operations

#### Check if Wallet is Installed
```javascript
import midnightWalletService from './services/midnightWallet';

if (midnightWalletService.constructor.isWalletInstalled()) {
  console.log('✅ Lace Midnight wallet detected');
} else {
  console.log('❌ Please install Lace wallet');
}
```

#### Connect to Wallet
```javascript
try {
  const connection = await midnightWalletService.connect();

  console.log('Address:', connection.address);
  console.log('Balance:', connection.balance, 'tDUST');
  console.log('Shielded Address:', connection.shieldAddress);
} catch (error) {
  if (error.message.includes('User rejected')) {
    console.log('User declined connection');
  }
}
```

#### Get Wallet Balance
```javascript
const balance = await midnightWalletService.getBalance();
console.log('Balance:', balance, 'tDUST');
```

#### Refresh Wallet State
```javascript
// Get updated balance and info
const newState = await midnightWalletService.refreshState();
console.log('Updated balance:', newState.balanceTDust);
```

#### Disconnect Wallet
```javascript
await midnightWalletService.disconnect();
```

### Transaction Operations

#### Sign a Transaction
```javascript
const transaction = {
  // Your transaction data
};

const signedTx = await midnightWalletService.signTransaction(transaction);
```

#### Submit a Transaction
```javascript
const txHash = await midnightWalletService.submitTransaction(signedTx);
console.log('Transaction submitted:', txHash);
```

### Event Handling

The wallet service dispatches custom events you can listen to:

```javascript
// Listen for wallet state changes
window.addEventListener('midnight:stateChanged', (event) => {
  const newState = event.detail;
  console.log('Wallet updated:', newState);
});

// Listen for disconnection
window.addEventListener('midnight:disconnected', () => {
  console.log('Wallet disconnected');
  // Update UI accordingly
});
```

## API Reference

### MidnightWalletService

#### Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `initialize()` | Detect and initialize Lace provider | `Promise<boolean>` |
| `connect()` | Request wallet connection | `Promise<{address, balance, shieldAddress, connected}>` |
| `disconnect()` | Disconnect wallet | `Promise<{connected: false}>` |
| `getAccount()` | Get current address | `string \| null` |
| `getBalance()` | Get tDUST balance | `Promise<number>` |
| `getWalletState()` | Get full wallet state | `WalletState \| null` |
| `getDetailedWalletInfo()` | Get formatted wallet info | `Object \| null` |
| `refreshState()` | Update wallet state | `Promise<WalletState>` |
| `signTransaction(tx)` | Sign transaction | `Promise<SignedTx>` |
| `submitTransaction(signedTx)` | Submit to network | `Promise<string>` |
| `isConnected()` | Check connection status | `boolean` |
| `getNetworkConfig()` | Get network settings | `Object` |

#### Static Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `isWalletInstalled()` | Check if Lace is installed | `boolean` |

## Configuration

### Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
# Network Configuration
REACT_APP_MIDNIGHT_NETWORK=devnet
REACT_APP_MIDNIGHT_RPC_URL=https://rpc.devnet.midnight.network

# Smart Contract Addresses (update after deployment)
REACT_APP_DATA_CONTRIBUTION_CONTRACT=0x...
REACT_APP_GOVERNANCE_DAO_CONTRACT=0x...
REACT_APP_INCENTIVE_TREASURY_CONTRACT=0x...
```

## Troubleshooting

### Wallet Not Detected

**Problem**: App says "Lace wallet not found"

**Solutions**:
1. Make sure Lace extension is installed and enabled
2. Refresh the page
3. Check browser console for errors
4. Try in a different browser (Chrome/Brave recommended)

### Connection Failed

**Problem**: Connection fails or times out

**Solutions**:
1. Make sure Lace wallet is unlocked
2. Check if you're on the correct network (devnet/testnet)
3. Clear browser cache and reload
4. Disable conflicting wallet extensions (MetaMask, etc.)

### Transaction Fails

**Problem**: Transaction signing or submission fails

**Solutions**:
1. Ensure you have sufficient tDUST balance
2. Check network connection
3. Verify contract addresses are correct
4. Check browser console for detailed error messages

### Balance Shows 0

**Problem**: Balance always shows 0

**Solutions**:
1. Request tokens from the testnet faucet
2. Wait for transaction confirmation (~30 seconds)
3. Click refresh to update wallet state
4. Verify you're on the correct network

## Testing the Integration

### Quick Test Checklist

- [ ] Lace wallet extension installed
- [ ] Wallet created/imported
- [ ] On Midnight testnet
- [ ] Test tokens received
- [ ] App detects wallet (no error on page load)
- [ ] "Connect Wallet" button appears
- [ ] Click connect → Lace popup appears
- [ ] Approve connection → Address displayed
- [ ] Balance shows correctly
- [ ] Can disconnect and reconnect

### Developer Console Tests

Open browser DevTools (F12) and run:

```javascript
// Check if wallet is available
console.log('Lace detected:', !!window.midnight?.lace);

// Check provider
console.log('Provider:', window.midnight?.lace);

// Manual connection test
if (window.midnight?.lace) {
  window.midnight.lace.enable().then(state => {
    console.log('Wallet state:', state);
  });
}
```

## DApp Connector API Version

This integration uses **@midnight-ntwrk/dapp-connector-api v3.0.0**, which supports:
- ✅ Bech32m address format
- ✅ HD wallet derivation
- ✅ Shielded transactions
- ✅ Multiple address types (coin, shielded, legacy)
- ✅ Event-driven state updates

## Additional Resources

- **Lace Wallet**: [https://www.lace.io/midnight](https://www.lace.io/midnight)
- **Midnight Docs**: [https://docs.midnight.network](https://docs.midnight.network)
- **DApp Connector API**: [https://www.npmjs.com/package/@midnight-ntwrk/dapp-connector-api](https://www.npmjs.com/package/@midnight-ntwrk/dapp-connector-api)
- **Midnight Discord**: Join for community support

## Security Best Practices

1. **Never share private keys or seed phrases**
2. **Always verify transaction details before signing**
3. **Only connect to trusted dApps**
4. **Keep your wallet software updated**
5. **Use testnet tokens for testing - never mainnet**
6. **Verify contract addresses match official deployments**

## Next Steps

1. ✅ Install Lace wallet
2. ✅ Get test tokens
3. ✅ Connect to EdgeChain
4. Start contributing agricultural data
5. Earn rewards for data contributions
6. Participate in DAO governance
7. Track your impact on the community

---

**Questions?** Check the [main documentation](README.md) or open an issue on GitHub.
