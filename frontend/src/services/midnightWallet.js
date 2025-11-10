/**
 * Midnight Wallet Integration Service
 * Handles wallet connection, account management, and transaction signing
 * Using Lace Midnight Preview wallet (window.midnight.lace or window.cardano.midnight)
 * Supports DApp Connector API v3.0.0 with Bech32m address format
 */

class MidnightWalletService {
  constructor() {
    this.provider = null;
    this.walletState = null;
    this.connected = false;
    this.networkConfig = {
      networkId: process.env.REACT_APP_MIDNIGHT_NETWORK || 'devnet',
      rpcUrl: process.env.REACT_APP_MIDNIGHT_RPC_URL || 'https://rpc.devnet.midnight.network',
    };
  }

  /**
   * Detect and initialize Lace Midnight wallet provider
   * Checks both window.midnight.lace and window.cardano.midnight
   */
  async initialize() {
    try {
      // Check for Lace Midnight provider in window.midnight.lace
      if (window.midnight?.lace) {
        this.provider = window.midnight.lace;
        console.log('✅ Lace Midnight wallet detected (window.midnight.lace)');
        return true;
      }

      // Fallback: Check window.cardano.midnight (older versions)
      if (window.cardano?.midnight) {
        this.provider = window.cardano.midnight;
        console.log('✅ Lace Midnight wallet detected (window.cardano.midnight)');
        return true;
      }

      console.warn('❌ Lace Midnight wallet not detected. Please install the Lace wallet browser extension.');
      return false;
    } catch (error) {
      console.error('Failed to initialize wallet provider:', error);
      throw error;
    }
  }

  /**
   * Connect to Lace Midnight wallet
   * Calls provider.enable() to request user authorization
   */
  async connect() {
    try {
      // Initialize provider if not already done
      if (!this.provider) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error(
            'Lace Midnight wallet not found. Please install the Lace wallet extension:\n' +
            'https://www.lace.io/midnight'
          );
        }
      }

      // Check if wallet is already enabled
      const isEnabled = await this.provider.isEnabled();
      if (isEnabled) {
        console.log('Wallet already enabled, fetching state...');
      }

      // Request wallet connection - this prompts user for approval
      const walletState = await this.provider.enable();

      if (!walletState) {
        throw new Error('Failed to enable wallet - no state returned');
      }

      this.walletState = walletState;
      this.connected = true;

      // Log wallet information
      console.log('🎉 Connected to Lace Midnight wallet');
      console.log('Wallet Address:', walletState.coinPublicKey || 'Not available');
      console.log('Network:', this.networkConfig.networkId);

      // Set up event listeners for account/network changes
      this.setupEventListeners();

      return {
        address: walletState.coinPublicKey,
        balance: walletState.balanceTDust || 0,
        shieldAddress: walletState.shieldedPublicKey || null,
        connected: true,
        walletState: walletState
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);

      // Provide helpful error messages
      if (error.message?.includes('User rejected')) {
        throw new Error('Wallet connection rejected by user');
      }

      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect() {
    this.walletState = null;
    this.connected = false;
    console.log('🔌 Wallet disconnected');

    return {
      connected: false
    };
  }

  /**
   * Get current wallet state
   */
  getWalletState() {
    return this.walletState;
  }

  /**
   * Get current account address
   */
  getAccount() {
    return this.walletState?.coinPublicKey || null;
  }

  /**
   * Check if wallet is connected
   */
  isConnected() {
    return this.connected && this.walletState !== null;
  }

  /**
   * Get wallet balance (in tDUST - Midnight testnet token)
   */
  async getBalance() {
    if (!this.connected || !this.walletState) {
      throw new Error('Wallet not connected');
    }

    try {
      // Return balance from wallet state
      return this.walletState.balanceTDust || 0;
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Refresh wallet state to get updated balance and info
   */
  async refreshState() {
    if (!this.provider || !this.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const walletState = await this.provider.state();
      this.walletState = walletState;
      return walletState;
    } catch (error) {
      console.error('Failed to refresh wallet state:', error);
      throw error;
    }
  }

  /**
   * Sign a transaction using Lace wallet
   */
  async signTransaction(transaction) {
    if (!this.connected || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      if (this.provider.signTx) {
        const signedTx = await this.provider.signTx(transaction);
        return signedTx;
      } else {
        throw new Error('signTx method not available on provider');
      }
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  }

  /**
   * Submit a signed transaction to the network
   */
  async submitTransaction(signedTransaction) {
    if (!this.connected || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      if (this.provider.submitTx) {
        const txHash = await this.provider.submitTx(signedTransaction);
        console.log('✅ Transaction submitted:', txHash);
        return txHash;
      } else {
        throw new Error('submitTx method not available on provider');
      }
    } catch (error) {
      console.error('Failed to submit transaction:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners for wallet state changes
   * Dispatches custom events that the app can listen to
   */
  setupEventListeners() {
    if (!this.provider) return;

    try {
      // Listen for wallet state changes (account, balance updates)
      if (this.provider.on) {
        this.provider.on('stateChanged', (newState) => {
          console.log('💫 Wallet state changed:', newState);
          this.walletState = newState;

          // Dispatch custom event for app to listen to
          window.dispatchEvent(new CustomEvent('midnight:stateChanged', {
            detail: newState
          }));
        });

        // Listen for disconnection
        this.provider.on('disconnect', () => {
          console.log('🔌 Wallet disconnected by user');
          this.disconnect();

          window.dispatchEvent(new CustomEvent('midnight:disconnected'));
        });
      }
    } catch (error) {
      console.warn('Event listeners not available:', error);
    }
  }

  /**
   * Check if Lace Midnight wallet is installed
   */
  static isWalletInstalled() {
    return !!(window.midnight?.lace || window.cardano?.midnight);
  }

  /**
   * Get network configuration
   */
  getNetworkConfig() {
    return this.networkConfig;
  }

  /**
   * Get wallet info (name, version, etc.)
   */
  async getWalletInfo() {
    if (!this.provider) {
      await this.initialize();
    }

    try {
      const info = {
        name: this.provider?.name || 'Lace Midnight',
        version: this.provider?.version || 'Unknown',
        icon: this.provider?.icon || null,
        apiVersion: this.provider?.apiVersion || 'Unknown'
      };

      return info;
    } catch (error) {
      console.error('Failed to get wallet info:', error);
      return null;
    }
  }

  /**
   * Get all available wallet information for display
   */
  getDetailedWalletInfo() {
    if (!this.walletState) {
      return null;
    }

    return {
      address: this.walletState.coinPublicKey,
      balance: this.walletState.balanceTDust || 0,
      shieldedAddress: this.walletState.shieldedPublicKey || null,
      shieldedCPK: this.walletState.shieldedCoinPublicKey || null,
      shieldedEPK: this.walletState.shieldedEncryptionPublicKey || null,
      legacyAddress: this.walletState.legacyAddress || null,
      network: this.networkConfig.networkId
    };
  }
}

// Export singleton instance
const midnightWalletService = new MidnightWalletService();
export default midnightWalletService;
