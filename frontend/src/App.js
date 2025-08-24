import React, { useState, useEffect } from "react";
import { Wallet, Leaf, Users, TrendingUp, Shield, DollarSign, BarChart3, Award } from "lucide-react";

const EdgeChainApp = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [farmerData, setFarmerData] = useState({
    name: "",
    farmSize: "",
    location: "",
    walletConnected: false,
    earnings: 0,
    dataContributions: 0,
    learningProgress: 0
  });
 
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

  const connectWallet = () => {
    setFarmerData(prev => ({ ...prev, walletConnected: true }));
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
            <button
              onClick={connectWallet}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Privacy Wallet & Start Earning
            </button>
          ) : (
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