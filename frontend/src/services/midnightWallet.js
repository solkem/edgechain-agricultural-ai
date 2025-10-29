/**
 * Midnight Wallet Integration Service
 * Handles wallet connection, account management, and transaction signing
 * Using Midnight wallet injected by Lace or compatible browser extension
 */

class MidnightWalletService {
  constructor() {
    this.wallet = null;
    this.account = null;
    this.connected = false;
    this.networkConfig = {
      networkId: 'devnet', // or 'testnet', 'mainnet'
      rpcUrl: 'https://rpc.devnet.midnight.network', // Replace with actual RPC URL
    };
  }

  /**
   * Initialize wallet provider
   */
  async initialize() {
    try {
      // Check if Midnight wallet is available
      if (typeof window.midnight !== 'undefined') {
        this.wallet = window.midnight;
        console.log('Midnight wallet detected');
        return true;
      } else {
        console.warn('Midnight wallet not detected');
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize wallet provider:', error);
      throw error;
    }
  }

  /**
   * Connect to Midnight wallet (e.g., Lace wallet)
   */
  async connect() {
    try {
      // Initialize if not already done
      if (!this.wallet) {
        await this.initialize();
      }

      // Check if Midnight wallet is available
      if (typeof window.midnight === 'undefined') {
        throw new Error('Midnight wallet not found. Please install Lace wallet or compatible wallet.');
      }

      // Request wallet connection
      const accounts = await window.midnight.enable();

      if (accounts && accounts.length > 0) {
        this.account = accounts[0];
        this.connected = true;

        console.log('Connected to Midnight wallet:', this.account);

        // Set up event listeners for account changes
        this.setupEventListeners();

        return {
          address: this.account,
          connected: true
        };
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect() {
    this.account = null;
    this.connected = false;
    console.log('Wallet disconnected');

    return {
      connected: false
    };
  }

  /**
   * Get current account
   */
  getAccount() {
    return this.account;
  }

  /**
   * Check if wallet is connected
   */
  isConnected() {
    return this.connected && this.account !== null;
  }

  /**
   * Get wallet balance
   */
  async getBalance() {
    if (!this.connected || !this.account) {
      throw new Error('Wallet not connected');
    }

    try {
      // Get balance from Midnight network via wallet
      if (this.wallet && this.wallet.getBalance) {
        const balance = await this.wallet.getBalance(this.account);
        return balance;
      } else {
        // Fallback: return 0 if method not available
        console.warn('getBalance method not available on wallet');
        return 0;
      }
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Sign a transaction
   */
  async signTransaction(transaction) {
    if (!this.connected || !this.account) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedTx = await window.midnight.signTransaction(transaction);
      return signedTx;
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  }

  /**
   * Send a transaction
   */
  async sendTransaction(transaction) {
    if (!this.connected || !this.account) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedTx = await this.signTransaction(transaction);

      // Send via wallet if method available
      if (this.wallet && this.wallet.sendTransaction) {
        const txHash = await this.wallet.sendTransaction(signedTx);
        console.log('Transaction sent:', txHash);
        return txHash;
      } else {
        console.warn('sendTransaction method not available on wallet');
        // Return mock tx hash for development
        return '0x' + Math.random().toString(16).slice(2);
      }
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners for wallet events
   */
  setupEventListeners() {
    if (window.midnight) {
      // Listen for account changes
      window.midnight.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else if (accounts[0] !== this.account) {
          this.account = accounts[0];
          console.log('Account changed:', this.account);
        }
      });

      // Listen for network changes
      window.midnight.on('networkChanged', (networkId) => {
        console.log('Network changed:', networkId);
        this.networkConfig.networkId = networkId;
      });

      // Listen for disconnection
      window.midnight.on('disconnect', () => {
        this.disconnect();
      });
    }
  }

  /**
   * Check if Midnight wallet is installed
   */
  static isWalletInstalled() {
    return typeof window.midnight !== 'undefined';
  }

  /**
   * Get network configuration
   */
  getNetworkConfig() {
    return this.networkConfig;
  }

  /**
   * Switch network
   */
  async switchNetwork(networkId) {
    try {
      await window.midnight.switchNetwork(networkId);
      this.networkConfig.networkId = networkId;
      console.log('Switched to network:', networkId);
      return true;
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  }
}

// Export singleton instance
const midnightWalletService = new MidnightWalletService();
export default midnightWalletService;
