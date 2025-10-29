import React, { useState, useEffect } from "react";
import { Wallet, Leaf, Users, TrendingUp, Shield, DollarSign, BarChart3, Award } from "lucide-react";
import midnightWalletService from "./services/midnightWallet";
import contractInteractionService from "./services/contractInteractions";

const EdgeChainApp = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [farmerData, setFarmerData] = useState({
    name: "",
    farmSize: "",
    location: "",
    walletConnected: false,
    walletAddress: "",
    earnings: 0,
    dataContributions: 0,
    learningProgress: 0
  });

  const [walletError, setWalletError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
 
  const [sensorData, setSensorData] = useState([]);
  const [communityStats, setCommunityStats] = useState({
    totalFarmers: 12,
    totalContributions: 1247,
    communityEarnings: 8430,
    modelAccuracy: 0.83
  });

  // Simulate sensor data generation
  useEffect(() => {
    const interval = setInterval(() => {
      if (farmerData.walletConnected) {
        const newReading = {
          timestamp: new Date().toLocaleTimeString(),
          soilMoisture: (Math.random() * 40 + 30).toFixed(1),
          temperature: (Math.random() * 15 + 20).toFixed(1),
          rainfall: (Math.random() * 5).toFixed(2),
          contribution: (Math.random() * 2 + 1).toFixed(2)
        };
       
        setSensorData(prev => [...prev.slice(-9), newReading]);
       
        setFarmerData(prev => ({
          ...prev,
          earnings: prev.earnings + parseFloat(newReading.contribution),
          dataContributions: prev.dataContributions + 1,
          learningProgress: Math.min(prev.learningProgress + 0.5, 100)
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [farmerData.walletConnected]);

  // Initialize services on component mount
  useEffect(() => {
    const initServices = async () => {
      try {
        await contractInteractionService.initialize();
      } catch (error) {
        console.error("Failed to initialize services:", error);
      }
    };
    initServices();
  }, []);

  // Connect to Midnight wallet
  const connectWallet = async () => {
    setIsConnecting(true);
    setWalletError(null);

    try {
      // Check if Midnight wallet is installed
      if (!midnightWalletService.constructor.isWalletInstalled()) {
        throw new Error(
          "Midnight wallet not found. Please install Lace wallet or compatible Midnight wallet extension."
        );
      }

      // Connect to wallet
      const connection = await midnightWalletService.connect();

      if (connection.connected) {
        setFarmerData(prev => ({
          ...prev,
          walletConnected: true,
          walletAddress: connection.address
        }));

        // Load farmer's data from blockchain
        await loadFarmerData();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setWalletError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    await midnightWalletService.disconnect();
    setFarmerData(prev => ({
      ...prev,
      walletConnected: false,
      walletAddress: "",
      earnings: 0,
      dataContributions: 0,
      learningProgress: 0
    }));
  };

  // Load farmer data from smart contracts
  const loadFarmerData = async () => {
    try {
      // Get contributions and rewards from DataContribution contract
      const contributions = await contractInteractionService.getMyContributions();
      const rewards = await contractInteractionService.getMyRewards();
      const balance = await contractInteractionService.getMyBalance();

      setFarmerData(prev => ({
        ...prev,
        dataContributions: contributions || 0,
        earnings: (rewards + balance) / 100 || 0, // Convert from smallest unit
      }));
    } catch (error) {
      console.error("Failed to load farmer data:", error);
    }
  };

  // Submit data contribution to blockchain
  const submitDataContribution = async (dataHash, quality) => {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const result = await contractInteractionService.contributeData(
        dataHash,
        quality,
        timestamp
      );

      if (result.success) {
        console.log("Data contribution submitted:", result.txHash);
        // Reload farmer data after successful contribution
        await loadFarmerData();
      }
    } catch (error) {
      console.error("Failed to submit data contribution:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Leaf className="mr-3 text-green-600" />
            EdgeChain
          </h1>
          <p className="text-xl text-gray-600">Community-Owned Agricultural Intelligence</p>
          <p className="text-sm text-gray-500 mt-2">
            Farmers building AI together • Privacy-preserved • Community-controlled
          </p>
        </header>

        {/* Simple demo interface */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Welcome to EdgeChain MVP
          </h2>
          <p className="text-gray-600 mb-4">
            This is the beginning of your EdgeChain Agricultural Intelligence system.
            Connect your wallet to start earning while building community-owned AI.
          </p>
         
          {!farmerData.walletConnected ? (
            <div>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isConnecting ? "Connecting to Midnight Network..." : "Connect Midnight Wallet & Start Earning"}
              </button>
              {walletError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">Connection Error</p>
                  <p className="text-red-600 text-sm mt-1">{walletError}</p>
                  <p className="text-gray-600 text-xs mt-2">
                    Make sure you have a Midnight-compatible wallet installed (e.g., Lace wallet).
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Connected:</span> {farmerData.walletAddress.slice(0, 8)}...{farmerData.walletAddress.slice(-6)}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-sm text-red-600 hover:text-red-700 underline"
                >
                  Disconnect
                </button>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">💰 Earnings</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${farmerData.earnings.toFixed(2)}
                </p>
              </div>
             
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">📊 Contributions</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {farmerData.dataContributions}
                </p>
              </div>
             
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">🎓 Learning Progress</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {farmerData.learningProgress.toFixed(1)}%
                </p>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Community Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="mr-2 text-indigo-600" />
            Community Impact
          </h3>
         
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{communityStats.totalFarmers}</p>
              <p className="text-sm text-gray-600">Active Farmers</p>
            </div>
           
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{communityStats.totalContributions.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Data Points</p>
            </div>
           
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">${communityStats.communityEarnings.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Community Earned</p>
            </div>
           
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{(communityStats.modelAccuracy * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Model Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdgeChainApp;