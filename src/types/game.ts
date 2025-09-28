export interface Game {
  gameId: string;
  player: string;
  betAmount: string;
  choice: number;
  result: number;
  won: boolean;
  timestamp: number;
  blockNumber: number;
  payout?: string;
}

export interface GameStats {
  totalGames: number;
  contractBalance: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string;
  balance: string;
  chainId: number;
}