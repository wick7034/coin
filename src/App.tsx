import React, { useState, useEffect } from 'react';
import { Coins, Github, Info } from 'lucide-react';
import { WalletConnect } from './components/WalletConnect';
import { CoinFlip } from './components/CoinFlip';
import { GameHistory } from './components/GameHistory';
import { GameStats } from './components/GameStats';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import { Game, GameStats as GameStatsType } from './types/game';

function App() {
  const { wallet, provider, connectWallet, disconnectWallet, updateBalance } = useWallet();
  const { playGame, getPlayerGames, getGameStats, loading } = useContract(provider);
  
  const [games, setGames] = useState<Game[]>([]);
  const [stats, setStats] = useState<GameStatsType | null>(null);
  const [lastGameResult, setLastGameResult] = useState<{ won: boolean; result: number } | null>(null);

  useEffect(() => {
    if (wallet.isConnected) {
      loadPlayerGames();
    }
  }, [wallet.isConnected]);

  useEffect(() => {
    loadGameStats();
    const interval = setInterval(loadGameStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPlayerGames = async () => {
    if (!wallet.address) return;
    const playerGames = await getPlayerGames(wallet.address);
    setGames(playerGames);
  };

  const loadGameStats = async () => {
    const gameStats = await getGameStats();
    setStats(gameStats);
  };

  const handlePlayGame = async (choice: number, betAmount: string): Promise<boolean> => {
    const success = await playGame(choice, betAmount);
    
    if (success) {
      // Simulate getting the result (in real implementation, listen to events)
      const result = Math.random() < 0.5 ? 0 : 1;
      const won = choice === result;
      
      setLastGameResult({ won, result });
      
      // Refresh data
      await updateBalance();
      await loadPlayerGames();
      await loadGameStats();
      
      // Show result notification
      setTimeout(() => setLastGameResult(null), 5000);
    }
    
    return success;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg 
                              flex items-center justify-center">
                <Coins className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoFlip</h1>
                <p className="text-xs text-gray-400">Decentralized Coinflip Gaming</p>
              </div>
            </div>
            
            <WalletConnect
              wallet={wallet}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
            />
          </div>
        </div>
      </header>

      {/* Game Result Notification */}
      {lastGameResult && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className={`p-4 rounded-lg shadow-lg ${
            lastGameResult.won 
              ? 'bg-green-900/90 border border-green-500/50' 
              : 'bg-red-900/90 border border-red-500/50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {lastGameResult.result === 0 ? '👑' : '⚡'}
              </div>
              <div>
                <div className={`font-bold ${lastGameResult.won ? 'text-green-400' : 'text-red-400'}`}>
                  {lastGameResult.won ? 'You Won!' : 'You Lost!'}
                </div>
                <div className="text-sm text-gray-300">
                  Result: {lastGameResult.result === 0 ? 'Heads' : 'Tails'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Section */}
          <div className="space-y-6">
            <CoinFlip
              onPlay={handlePlayGame}
              loading={loading}
              isConnected={wallet.isConnected}
            />
            
            <GameStats stats={stats} />
          </div>

          {/* History Section */}
          <div>
            <GameHistory games={games} />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Info className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">How It Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Connect Wallet</h3>
              <p className="text-sm text-gray-400">Connect your MetaMask or Web3 wallet to start playing</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Choose Side</h3>
              <p className="text-sm text-gray-400">Pick heads or tails and set your bet amount</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🪙</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Flip Coin</h3>
              <p className="text-sm text-gray-400">Smart contract generates provably fair random result</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Win Rewards</h3>
              <p className="text-sm text-gray-400">Get 1.96x your bet amount instantly on wins</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-200 text-sm">
              ⚠️ <strong>Demo Mode:</strong> This is a demonstration version. In production, 
              the smart contract would be deployed to a testnet or mainnet. 
              Always verify contract addresses and audit smart contracts before playing with real funds.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Coins className="text-purple-400" size={20} />
                <span className="text-white font-semibold">CryptoFlip</span>
              </div>
              <span className="text-gray-400 text-sm">
                Decentralized • Provably Fair • Instant Payouts
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800/50 text-center text-gray-400 text-sm">
            <p>Smart contracts ensure fair play and instant payouts. House edge: 2%</p>
            <p className="mt-1">Always gamble responsibly and within your means.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;