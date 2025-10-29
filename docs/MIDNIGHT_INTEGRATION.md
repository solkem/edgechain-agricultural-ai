# Midnight Network Integration Guide

## Overview

EdgeChain has been integrated with the **Midnight blockchain network**, leveraging its privacy-preserving technology and **Compact programming language** to create a secure, transparent, and fair agricultural AI platform.

## What is Midnight?

[Midnight](https://midnight.network/) is a privacy-focused blockchain platform that brings "rational privacy" to decentralized applications. It enables developers to build applications that protect sensitive data while maintaining transparency where needed.

### Key Features

- **Zero-Knowledge Proofs:** Protect user privacy while proving data validity
- **Compact Language:** TypeScript-like language for writing smart contracts
- **Data Protection:** Separate private and public state in smart contracts
- **Developer-Friendly:** Easy integration with existing web technologies

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EdgeChain Frontend                        │
│                     (React App)                              │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Web3 Integration
               │
┌──────────────▼──────────────────────────────────────────────┐
│            Midnight Wallet Service                           │
│        (@midnight-ntwrk/wallet)                             │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ RPC Connection
               │
┌──────────────▼──────────────────────────────────────────────┐
│              Midnight Network                                │
│            (Devnet/Testnet/Mainnet)                         │
└──────────────┬──────────────────────────────────────────────┘
               │
       ┌───────┼───────┐
       │       │       │
┌──────▼─┐ ┌──▼─────┐ ┌▼──────────┐
│  Data  │ │Govern  │ │Incentive  │
│Contrib │ │anceDAO │ │Treasury   │
│Contract│ │Contract│ │Contract   │
└────────┘ └────────┘ └───────────┘
  (Compact)  (Compact)   (Compact)
```

## Smart Contracts

EdgeChain uses three main Compact smart contracts on Midnight:

### 1. DataContribution Contract

**Purpose:** Track farmer data contributions and calculate rewards

**Privacy Features:**
- Private farmer contribution counts
- Private reward balances
- Public aggregate statistics

**Key Operations:**
```javascript
// Submit data contribution (privacy-preserving)
await contributeData(dataHash, qualityScore, timestamp);

// Claim accumulated rewards
await claimRewards();

// Get personal stats (private)
const myContributions = await getMyContributions();
const myRewards = await getMyRewards();
```

### 2. GovernanceDAO Contract

**Purpose:** Enable democratic community governance with quadratic voting

**Privacy Features:**
- Private vote records
- Private voter power
- Public proposal results

**Key Operations:**
```javascript
// Join the DAO
await joinDAO();

// Create a proposal
await createProposal("Proposal Title", "Description");

// Vote (quadratic voting)
await vote(proposalId, support); // Vote weight = sqrt(voting power)

// Execute passed proposal
await executeProposal(proposalId);
```

### 3. IncentiveTreasury Contract

**Purpose:** Manage community funds and distribute incentives

**Privacy Features:**
- Private farmer balances
- Private withdrawal requests
- Public treasury totals

**Key Operations:**
```javascript
// Get personal balance (private)
const balance = await getMyBalance();

// Request withdrawal
await requestWithdrawal(amount);

// Create milestone
await createMilestone(targetMetric, rewardAmount, rewardType);
```

## Frontend Integration

### Wallet Connection

EdgeChain uses the Midnight wallet SDK to connect to user wallets:

```javascript
import midnightWalletService from './services/midnightWallet';

// Connect to wallet
const connection = await midnightWalletService.connect();

// Check connection status
const isConnected = midnightWalletService.isConnected();

// Get account
const account = midnightWalletService.getAccount();
```

### Contract Interactions

Use the contract interaction service to call smart contract functions:

```javascript
import contractInteractionService from './services/contractInteractions';

// Initialize contracts
await contractInteractionService.initialize();

// Submit data contribution
await contractInteractionService.contributeData(
  dataHash,
  qualityScore,
  timestamp
);

// Vote on proposal
await contractInteractionService.vote(proposalId, true);
```

## Privacy Model

### What's Private

✅ Individual farmer contribution counts
✅ Individual reward balances
✅ Vote records (who voted for what)
✅ Withdrawal requests
✅ Farmer-specific data

### What's Public

✅ Total community contributions
✅ Total rewards distributed
✅ Proposal information
✅ Proposal vote counts (aggregated)
✅ Community milestones
✅ Treasury totals

## Zero-Knowledge Proofs

Midnight uses zero-knowledge proofs to enable privacy while maintaining verifiability:

```
Farmer submits data contribution
       ↓
ZK Proof Generated: "I contributed valid data with quality > threshold"
       ↓
Smart Contract Verifies Proof (without seeing actual data)
       ↓
Reward Calculated and Allocated (privately)
       ↓
Farmer's private balance updated
```

## Setup Instructions

### 1. Install Midnight Wallet

Install a Midnight-compatible wallet:
- [Lace Wallet](https://www.lace.io/) (recommended)
- Or any compatible Midnight wallet

### 2. Configure Network

Create a `.env.local` file in the `frontend/` directory:

```env
REACT_APP_MIDNIGHT_NETWORK=devnet
REACT_APP_MIDNIGHT_RPC_URL=https://rpc.devnet.midnight.network
REACT_APP_DATA_CONTRIBUTION_CONTRACT=0x...
REACT_APP_GOVERNANCE_DAO_CONTRACT=0x...
REACT_APP_INCENTIVE_TREASURY_CONTRACT=0x...
```

### 3. Connect Wallet

1. Open EdgeChain application
2. Click "Connect Midnight Wallet"
3. Approve connection in wallet
4. Start contributing data and earning rewards!

## Development Workflow

### Local Development

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm start

# The app will run on http://localhost:3000
```

### Deploying Contracts

```bash
# Navigate to contracts directory
cd contracts

# Compile contracts
compact compile src/DataContribution.compact
compact compile src/GovernanceDAO.compact
compact compile src/IncentiveTreasury.compact

# Deploy to devnet
compact deploy build/DataContribution.json --network devnet
compact deploy build/GovernanceDAO.json --network devnet
compact deploy build/IncentiveTreasury.json --network devnet

# Update frontend .env.local with deployed addresses
```

## Benefits of Midnight Integration

### For Farmers

1. **Privacy Protection**
   - Data contributions remain private
   - Earnings are confidential
   - Identity protected through ZK proofs

2. **Fair Rewards**
   - Transparent reward calculation
   - Quality-based incentives
   - Guaranteed payment through smart contracts

3. **Democratic Governance**
   - Quadratic voting prevents plutocracy
   - Participate in community decisions
   - Propose improvements

### For the Platform

1. **Trust Through Transparency**
   - Public verification of total rewards
   - Open-source smart contracts
   - Auditable on blockchain

2. **Scalability**
   - Efficient zero-knowledge proofs
   - Fast transaction processing
   - Low fees on Midnight network

3. **Compliance**
   - Privacy-by-design meets regulations
   - Data minimization
   - User consent and control

## Example Use Cases

### 1. Contributing Sensor Data

```javascript
// Farmer collects sensor data
const sensorData = {
  soilMoisture: 45.2,
  temperature: 28.5,
  humidity: 65.3
};

// Hash the data
const dataHash = hashData(sensorData);

// Calculate quality score
const quality = calculateQuality(sensorData);

// Submit to blockchain (data stays private)
await contractInteractionService.contributeData(
  dataHash,
  quality,
  Date.now()
);

// Farmer's rewards updated privately
// Community stats updated publicly
```

### 2. Participating in Governance

```javascript
// Create a proposal
await contractInteractionService.createProposal(
  "Increase Quality Threshold",
  "Propose raising the data quality threshold from 70% to 80%"
);

// Other farmers vote
await contractInteractionService.vote(proposalId, true);

// Vote weight is sqrt(voting power) for fairness
// Vote is recorded privately
// Only aggregated results are public
```

### 3. Claiming Rewards

```javascript
// Check pending rewards (private)
const rewards = await contractInteractionService.getMyRewards();

// Claim rewards
await contractInteractionService.claimRewards();

// Funds transferred to farmer's wallet
```

## Security Best Practices

1. **Never share your private key**
2. **Verify contract addresses** before interacting
3. **Start with small amounts** on testnet
4. **Review transactions** before signing
5. **Keep wallet software updated**

## Troubleshooting

### Wallet Not Connecting

- Ensure Midnight wallet extension is installed
- Check that you're on the correct network (devnet/testnet)
- Try refreshing the page
- Check browser console for errors

### Transaction Failing

- Ensure sufficient balance for gas fees
- Verify contract addresses are correct
- Check network status
- Review transaction parameters

### Data Not Updating

- Wait for transaction confirmation
- Refresh the page
- Check transaction status on Midnight explorer
- Verify wallet is still connected

## Resources

- [Midnight Official Website](https://midnight.network/)
- [Midnight Documentation](https://docs.midnight.network/)
- [Compact Language Reference](https://docs.midnight.network/develop/reference/compact/)
- [Midnight Developer Academy](https://midnight.network/learn)
- [EdgeChain GitHub Repository](https://github.com/solkem/edgechain-agricultural-ai)

## Future Enhancements

1. **Cross-Chain Bridges**
   - Connect with other blockchain networks
   - Enable multi-chain rewards

2. **Advanced Analytics**
   - Privacy-preserving data analytics
   - Encrypted model training metrics

3. **Mobile Wallet Support**
   - Mobile app integration
   - QR code scanning

4. **Enhanced Governance**
   - Delegation mechanisms
   - Multi-signature proposals
   - Time-locked treasury

## Contributing

We welcome contributions to improve the Midnight integration! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For questions or issues:
- GitHub Issues: https://github.com/solkem/edgechain-agricultural-ai/issues
- Midnight Discord: https://discord.gg/midnight
- Email: support@edgechain.example
