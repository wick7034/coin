import React from 'react';
import { Clock, Trophy, X } from 'lucide-react';
import { Game } from '../types/game';

interface GameHistoryProps {
  games: Game[];
}

export const GameHistory: React.FC<GameHistoryProps> = ({ games }) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getChoiceText = (choice: number) => choice === 0 ? 'Heads' : 'Tails';
  const getResultText = (result: number) => result === 0 ? 'Heads' : 'Tails';

  if (games.length === 0) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Game History</h3>
        <div className="text-center text-gray-400 py-8">
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p>No games played yet</p>
          <p className="text-sm">Your game history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-bold text-white mb-6">Game History</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {games.map((game) => (
          <div
            key={game.gameId}
            className={`p-4 rounded-lg border ${
              game.won
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-red-900/20 border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {game.won ? (
                  <Trophy className="text-green-400" size={16} />
                ) : (
                  <X className="text-red-400" size={16} />
                )}
                <span className={`font-semibold ${game.won ? 'text-green-400' : 'text-red-400'}`}>
                  {game.won ? 'Won' : 'Lost'}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                #{game.gameId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Bet</div>
                <div className="text-white">{parseFloat(game.betAmount).toFixed(4)} ETH</div>
              </div>
              <div>
                <div className="text-gray-400">Choice</div>
                <div className="text-white">{getChoiceText(game.choice)}</div>
              </div>
              <div>
                <div className="text-gray-400">Result</div>
                <div className="text-white">{getResultText(game.result)}</div>
              </div>
              <div>
                <div className="text-gray-400">Payout</div>
                <div className={`font-semibold ${game.won ? 'text-green-400' : 'text-red-400'}`}>
                  {game.won 
                    ? `+${(parseFloat(game.betAmount) * 1.96).toFixed(4)} ETH`
                    : `-${parseFloat(game.betAmount).toFixed(4)} ETH`
                  }
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              {formatTimestamp(game.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};