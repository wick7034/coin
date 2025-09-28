import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { WalletState } from '../types/game';

interface WalletConnectProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  onConnect,
  onDisconnect,
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(4);
  };

  if (!wallet.isConnected) {
    return (
      <button
        onClick={onConnect}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 
                   text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 
                   transform hover:scale-105 shadow-lg"
      >
        <Wallet size={20} />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm rounded-lg p-3">
      <div className="flex flex-col">
        <span className="text-sm text-gray-300">{formatAddress(wallet.address)}</span>
        <span className="text-xs text-green-400">{formatBalance(wallet.balance)} ETH</span>
      </div>
      <button
        onClick={onDisconnect}
        className="p-2 text-gray-400 hover:text-white transition-colors"
        title="Disconnect Wallet"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
};