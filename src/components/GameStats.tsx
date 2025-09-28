import React from 'react';
import { BarChart3, DollarSign, Users } from 'lucide-react';
import { GameStats as GameStatsType } from '../types/game';

interface GameStatsProps {
  stats: GameStatsType | null;
}

export const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Game Statistics</h3>
        <div className="text-center text-gray-400 py-4">
          Loading stats...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-bold text-white mb-6">Game Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-purple-400" size={20} />
            <span className="text-purple-400 font-medium">Total Games</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.totalGames.toLocaleString()}
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-400" size={20} />
            <span className="text-green-400 font-medium">Prize Pool</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {parseFloat(stats.contractBalance).toFixed(2)} ETH
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="text-blue-400" size={16} />
          <span className="text-blue-400 text-sm font-medium">Fair Gaming</span>
        </div>
        <p className="text-xs text-gray-300">
          All games use provably fair randomization with 2% house edge. 
          Results are determined by blockchain block properties ensuring transparency.
        </p>
      </div>
    </div>
  );
};