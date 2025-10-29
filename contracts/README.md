# EdgeChain Midnight Smart Contracts

This directory contains the Compact smart contracts for EdgeChain, designed to run on the Midnight blockchain network. These contracts enable privacy-preserving data contribution tracking, community governance, and fair reward distribution for agricultural AI development.

## Overview

EdgeChain uses **Midnight's Compact language** to implement zero-knowledge proof-based smart contracts that protect farmer privacy while enabling transparent incentive distribution and democratic governance.

## Smart Contracts

### 1. DataContribution.compact

Manages farmer data contributions and reward calculations using zero-knowledge proofs.

**Key Features:**
- Privacy-preserving data contribution tracking
- Quality-based reward calculation
- Private farmer contribution counts and rewards
- Public aggregate statistics

**Main Circuits:**
- `contributeData()` - Submit data contribution with quality score
- `claimRewards()` - Claim accumulated rewards
- `getMyContributions()` - Get personal contribution count (private)
- `getMyRewards()` - Get pending rewards (private)

### 2. GovernanceDAO.compact

Implements community governance with quadratic voting for fair decision-making.

**Key Features:**
- Proposal creation and management
- Quadratic voting (vote weight = sqrt(voting power))
- Privacy-preserving vote recording
- Quorum and execution logic

**Main Circuits:**
- `createProposal()` - Create a new governance proposal
- `vote()` - Vote on a proposal using quadratic voting
- `executeProposal()` - Execute a passed proposal
- `joinDAO()` - Join as a DAO member

### 3. IncentiveTreasury.compact

Manages the community treasury and distributes various types of incentives.

**Key Features:**
- Multi-type reward distribution (data quality, participation, milestones, etc.)
- Milestone-based community rewards
- Private farmer balances
- Community pool for collective rewards

**Main Circuits:**
- `distributeReward()` - Distribute rewards to farmers
- `createMilestone()` - Create a community milestone
- `achieveMilestone()` - Trigger milestone rewards
- `requestWithdrawal()` - Request reward withdrawal
- `getMyBalance()` - Get personal balance (private)

## Technology Stack

- **Language:** Compact (Midnight's domain-specific language)
- **Runtime:** Midnight blockchain
- **Privacy:** Zero-Knowledge Proofs (zk-SNARKs)
- **Features:** Privacy-preserving state, public/private data separation

## Setup and Installation

### Prerequisites

1. **Node.js 20+** - Required for Midnight tooling
2. **Compact Compiler** - Install using the `compact` CLI tool
3. **Midnight Wallet** - Lace wallet or compatible Midnight wallet

### Installing Compact Compiler

```bash
# Install the Compact CLI tool
npm install -g @midnight-ntwrk/compact-cli

# Verify installation
compact --version
```

## Compiling Contracts

```bash
# Navigate to contracts directory
cd contracts

# Compile all contracts
compact compile src/DataContribution.compact
compact compile src/GovernanceDAO.compact
compact compile src/IncentiveTreasury.compact

# Output will be in build/ directory
```

## Testing Contracts

```bash
# Run tests (when implemented)
compact test

# Run specific test
compact test DataContribution.test.js
```

## Deployment

### Deploy to Midnight Devnet

```bash
# Set your wallet private key
export MIDNIGHT_PRIVATE_KEY="your-private-key"

# Deploy DataContribution contract
compact deploy build/DataContribution.json --network devnet

# Deploy GovernanceDAO contract
compact deploy build/GovernanceDAO.json --network devnet

# Deploy IncentiveTreasury contract
compact deploy build/IncentiveTreasury.json --network devnet
```

### Deploy to Midnight Testnet

```bash
# Deploy to testnet
compact deploy build/DataContribution.json --network testnet
compact deploy build/GovernanceDAO.json --network testnet
compact deploy build/IncentiveTreasury.json --network testnet
```

### Initialize Contracts

After deployment, initialize each contract:

```javascript
// Initialize DataContribution
await dataContribution.initialize(70); // 70% quality threshold

// Initialize GovernanceDAO
await governanceDAO.initialize(
  604800,  // 7 days voting period in seconds
  20       // 20% quorum percentage
);

// Initialize IncentiveTreasury
await incentiveTreasury.initialize();
```

## Contract Addresses

After deployment, update the frontend environment variables:

```bash
# Edit frontend/.env.local
REACT_APP_DATA_CONTRIBUTION_CONTRACT=0x...
REACT_APP_GOVERNANCE_DAO_CONTRACT=0x...
REACT_APP_INCENTIVE_TREASURY_CONTRACT=0x...
```

## Privacy Features

All contracts leverage Midnight's zero-knowledge proof capabilities:

1. **Private State:**
   - Farmer balances
   - Individual contribution counts
   - Vote records
   - Withdrawal requests

2. **Public State:**
   - Aggregate statistics
   - Total contributions
   - Proposal information
   - Community milestones

3. **Zero-Knowledge Proofs:**
   - Contributions verified without revealing data
   - Voting power calculated privately
   - Reward claims validated without exposing balances

## Development Workflow

1. **Edit Contracts:** Modify `.compact` files in `src/`
2. **Compile:** Run `compact compile` to generate artifacts
3. **Test:** Write tests in `test/` directory
4. **Deploy:** Deploy to devnet/testnet for testing
5. **Verify:** Verify contract on Midnight explorer
6. **Integrate:** Update frontend with contract addresses

## Resources

- [Midnight Documentation](https://docs.midnight.network/)
- [Compact Language Reference](https://docs.midnight.network/develop/reference/compact/)
- [Midnight Developer Academy](https://midnight.network/learn)
- [Compact Tutorial](https://midnight.network/blog/tutorial-building-a-bulletin-board-smart-contract-with-compact)

## Security Considerations

1. **Access Control:** Implement proper role-based access control in production
2. **Governance:** Restrict administrative functions to governance contract
3. **Auditing:** Get contracts audited before mainnet deployment
4. **Testing:** Thoroughly test all circuits before deployment
5. **Upgrades:** Plan for contract upgrade mechanisms

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please follow the development workflow and ensure all tests pass before submitting PRs.

## Support

For issues or questions:
- GitHub Issues: [EdgeChain Repository](https://github.com/solkem/edgechain-agricultural-ai)
- Midnight Discord: [Join Community](https://discord.gg/midnight)
