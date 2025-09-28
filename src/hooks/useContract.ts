import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Game, GameStats } from '../types/game';

const COINFLIP_ABI = [
  "function playGame(uint256 choice) external payable",
  "function getPlayerGames(address player) external view returns (uint256[])",
  "function getGame(uint256 gameId) external view returns (tuple(address player, uint256 betAmount, uint256 choice, uint256 result, bool won, uint256 timestamp, uint256 blockNumber))",
  "function getContractBalance() external view returns (uint256)",
  "function getGameStats() external view returns (uint256 totalGames, uint256 contractBalance)",
  "event GamePlayed(uint256 indexed gameId, address indexed player, uint256 betAmount, uint256 choice, uint256 result, bool won, uint256 payout)"
];

// For demo purposes - in production, deploy to testnet/mainnet
const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

export const useContract = (provider: ethers.BrowserProvider | null) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, COINFLIP_ABI, provider);
      setContract(contractInstance);
    }
  }, [provider]);

  const playGame = async (choice: number, betAmount: string): Promise<boolean> => {
    if (!contract || !provider) return false;

    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      const tx = await contractWithSigner.playGame(choice, {
        value: ethers.parseEther(betAmount)
      });
      
      await tx.wait();
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error playing game:', error);
      setLoading(false);
      return false;
    }
  };

  const getPlayerGames = async (playerAddress: string): Promise<Game[]> => {
    if (!contract) return [];

    try {
      const gameIds = await contract.getPlayerGames(playerAddress);
      const games: Game[] = [];

      for (const gameId of gameIds) {
        const gameData = await contract.getGame(gameId);
        games.push({
          gameId: gameId.toString(),
          player: gameData.player,
          betAmount: ethers.formatEther(gameData.betAmount),
          choice: Number(gameData.choice),
          result: Number(gameData.result),
          won: gameData.won,
          timestamp: Number(gameData.timestamp),
          blockNumber: Number(gameData.blockNumber),
        });
      }

      return games.reverse(); // Most recent first
    } catch (error) {
      console.error('Error fetching player games:', error);
      return [];
    }
  };

  const getGameStats = async (): Promise<GameStats | null> => {
    if (!contract) return null;

    try {
      const stats = await contract.getGameStats();
      return {
        totalGames: Number(stats.totalGames),
        contractBalance: ethers.formatEther(stats.contractBalance),
      };
    } catch (error) {
      console.error('Error fetching game stats:', error);
      return null;
    }
  };

  return {
    playGame,
    getPlayerGames,
    getGameStats,
    loading,
  };
};