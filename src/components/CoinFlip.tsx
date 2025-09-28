import React, { useState } from 'react';
import { Coins, TrendingUp } from 'lucide-react';

interface CoinFlipProps {
  onPlay: (choice: number, betAmount: string) => Promise<boolean>;
  loading: boolean;
  isConnected: boolean;
}

export const CoinFlip: React.FC<CoinFlipProps> = ({ onPlay, loading, isConnected }) => {
  const [betAmount, setBetAmount] = useState('0.01');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handlePlay = async () => {
    if (selectedChoice === null || !betAmount) return;

    setIsFlipping(true);
    const success = await onPlay(selectedChoice, betAmount);
    
    // Simulate coin flip animation
    setTimeout(() => {
      setIsFlipping(false);
      if (success) {
        setSelectedChoice(null);
      }
    }, 2000);
  };

  const quickBetAmounts = ['0.001', '0.01', '0.1', '0.5'];

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
      <div className="text-center mb-8">
        <div className="relative">
          <div className={`coin ${isFlipping ? 'flipping' : ''} mx-auto mb-6`}>
            <div className="coin-inner">
              <div className="coin-front">
                <div className="text-4xl">👑</div>
                <div className="text-xs mt-2">HEADS</div>
              </div>
              <div className="coin-back">
                <div className="text-4xl">⚡</div>
                <div className="text-xs mt-2">TAILS</div>
              </div>
            </div>
          </div>
          {isFlipping && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-24 w-24 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Side</h2>
        <p className="text-gray-400">Pick heads or tails and place your bet</p>
      </div>

      <div className="space-y-6">
        {/* Choice Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedChoice(0)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedChoice === 0
                ? 'border-purple-500 bg-purple-500/20 text-white'
                : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="text-3xl mb-2">👑</div>
            <div className="font-semibold">HEADS</div>
            <div className="text-sm text-gray-400">2x payout</div>
          </button>
          
          <button
            onClick={() => setSelectedChoice(1)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedChoice === 1
                ? 'border-purple-500 bg-purple-500/20 text-white'
                : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-semibold">TAILS</div>
            <div className="text-sm text-gray-400">2x payout</div>
          </button>
        </div>

        {/* Bet Amount */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Bet Amount (ETH)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min="0.001"
              max="1"
              step="0.001"
              className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg 
                         text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="Enter bet amount"
            />
            <Coins className="text-gray-400" size={20} />
          </div>
          
          <div className="flex gap-2">
            {quickBetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className="px-3 py-1 text-sm bg-gray-700/50 text-gray-300 rounded-md 
                           hover:bg-gray-600 transition-colors"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Potential Payout */}
        {betAmount && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-green-400 flex items-center gap-2">
                <TrendingUp size={16} />
                Potential Payout
              </span>
              <span className="text-white font-bold">
                {(parseFloat(betAmount) * 1.96).toFixed(4)} ETH
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              (2% house edge applied)
            </div>
          </div>
        )}

        {/* Play Button */}
        <button
          onClick={handlePlay}
          disabled={!isConnected || selectedChoice === null || !betAmount || loading || isFlipping}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white 
                     rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed
                     hover:from-purple-700 hover:to-blue-700 transition-all duration-200
                     transform hover:scale-105 shadow-lg"
        >
          {!isConnected 
            ? 'Connect Wallet to Play' 
            : loading || isFlipping
            ? 'Flipping...'
            : 'Flip Coin'}
        </button>
      </div>

      <style jsx>{`
        .coin {
          width: 100px;
          height: 100px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }

        .coin.flipping {
          animation: flipCoin 2s ease-in-out;
        }

        .coin-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .coin-front,
        .coin-back {
          width: 100%;
          height: 100%;
          position: absolute;
          backface-visibility: hidden;
          border-radius: 50%;
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          border: 4px solid #b8860b;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #8b4513;
          font-weight: bold;
        }

        .coin-back {
          transform: rotateY(180deg);
        }

        @keyframes flipCoin {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(1800deg) rotateX(360deg); }
          100% { transform: rotateY(1800deg) rotateX(360deg); }
        }
      `}</style>
    </div>
  );
};