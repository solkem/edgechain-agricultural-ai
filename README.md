# 🌱 EdgeChain: Privacy-Enhancing Community-Owned Agricultural Intelligence
![EdgeChain Banner](https://github.com/solkem/edgechain-agricultural-ai/blob/main/docs/images/EdgeChain.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built with FastAPI](https://img.shields.io/badge/Built%20with-FastAPI-blue.svg)](https://fastapi.tiangolo.com/)
[![Federated Learning](https://img.shields.io/badge/Powered%20by-Federated%20Learning-orange.svg)]()
[![Blockchain Ready](https://img.shields.io/badge/Blockchain-Enabled-purple.svg)]()

---

## 🌐 Live Demo

[👉 Try the Mock MVP](https://solkem.github.io/edgechain-agricultural-ai/)

> This is a lightweight prototype to showcase the EdgeChain concept.  
> Full functionality and integrations are under active development.
## 🚜 Why EdgeChain?

EdgeChain empowers **farmers as co-creators of technology**.  
By blending **edge AI, federated learning, privacy-preserving data sharing, and blockchain incentives**, we transform raw farm data into **collective intelligence** while keeping farmers in control of their privacy and rewards.

- 🌱 **Farmers First** → Ownership of data, models, and economic rewards  
- 🔒 **Privacy by Design** → No raw data leaves the farm  
- 🤝 **Collaborative Intelligence** → Federated learning builds stronger predictions for all  
- 💰 **Fair Rewards** → Transparent incentives via smart contracts  
- 🗳️ **Democratic Governance** → DAO-based voting and treasury management  

---

## 🏗️ Core Architecture

### 1. 🌐 Edge Computing and IoT Layer  
- Raspberry Pi + soil/temperature/humidity/rainfall sensors  
- TinyML inference for immediate insights  
- Offline-first design with sync to community nodes  

### 2. 🔒 Privacy-Preserving Contribution  
- Zero-Knowledge Proofs (zk-SNARKs)  
- Homomorphic encryption + differential privacy  
- IPFS storage for proofs  

### 3. 🤝 Federated Learning Framework  
- TensorFlow Federated / Flower orchestration  
- Local training, global aggregation  
- Crop yield prediction & anomaly detection models  

### 4. ⛓️ Blockchain Incentive System  
- Smart contracts   
- Incentives: **data quality**, **participation**, **community milestones**, **learning progress**  

### 5. 🗳️ Community Governance Platform  
- DAO smart contracts  
- Quadratic voting for fairness  
- Treasury + proposal system  

---

## ⚙️ Technical Stack

**Backend:** FastAPI, PostgreSQL, Redis, Celery  
**Frontend:** React, Lucide-React, Recharts  
**Edge Devices:** Raspberry Pi 4, Python, LoRa/WiFi mesh  
**Federated Learning:** TensorFlow Federated, PySyft, Flower  
**Blockchain:**  Midnight, IPFS  
**Deployment:** Docker & Docker Compose  

---

## 🌙 Midnight Network Integration

EdgeChain is integrated with the **[Midnight blockchain network](https://midnight.network/)**, leveraging its privacy-preserving technology and **Compact programming language** for zero-knowledge smart contracts.

### Smart Contracts (Compact)

- **DataContribution.compact** - Privacy-preserving data contribution tracking and rewards
- **GovernanceDAO.compact** - Democratic governance with quadratic voting
- **IncentiveTreasury.compact** - Community treasury and incentive distribution

### Privacy Features

- ✅ **Zero-Knowledge Proofs** - Prove data validity without revealing the data
- ✅ **Private Balances** - Individual rewards kept confidential
- ✅ **Public Transparency** - Aggregate statistics visible to all
- ✅ **Secure Voting** - Vote privately while results remain transparent

📖 **[Read Full Integration Guide →](docs/MIDNIGHT_INTEGRATION.md)**

---

## 🚀 Quick Start

Clone and install:

```bash
git clone https://github.com/solkem/edgechain-agricultural-ai.git
cd edgechain-agricultural-ai

# Frontend setup
cd frontend
npm install
npm start

# The app will run on http://localhost:3000
```

### Lace Midnight Wallet Setup

**✅ INTEGRATED - Ready to use!**

1. **Install Lace Wallet**: Get the [Lace Midnight Preview](https://www.lace.io/midnight) browser extension
2. **Create/Import Wallet**: Set up your Midnight wallet and get test tokens
3. **Configure Environment**: Copy `frontend/.env.example` to `frontend/.env.local`
4. **Connect & Earn**: Click "Connect Wallet" in the app to start!

📖 **[Complete Setup Guide →](LACE_WALLET_SETUP.md)**

🧪 **Test Wallet Integration**: Open `/test-wallet.html` in your browser after running the app


