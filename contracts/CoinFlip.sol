// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoinFlip is ReentrancyGuard, Ownable {
    uint256 private constant HOUSE_EDGE = 200; // 2% house edge (out of 10000)
    uint256 private constant MAX_BET = 1 ether;
    uint256 private constant MIN_BET = 0.001 ether;
    
    struct Game {
        address player;
        uint256 betAmount;
        uint256 choice; // 0 = heads, 1 = tails
        uint256 result; // 0 = heads, 1 = tails
        bool won;
        uint256 timestamp;
        uint256 blockNumber;
    }
    
    mapping(uint256 => Game) public games;
    mapping(address => uint256[]) public playerGames;
    uint256 public gameCounter;
    
    event GamePlayed(
        uint256 indexed gameId,
        address indexed player,
        uint256 betAmount,
        uint256 choice,
        uint256 result,
        bool won,
        uint256 payout
    );
    
    event FundsDeposited(address indexed owner, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    modifier validBet(uint256 amount) {
        require(amount >= MIN_BET, "Bet amount too low");
        require(amount <= MAX_BET, "Bet amount too high");
        require(amount <= address(this).balance / 2, "Insufficient contract balance");
        _;
    }
    
    modifier validChoice(uint256 choice) {
        require(choice == 0 || choice == 1, "Invalid choice: must be 0 (heads) or 1 (tails)");
        _;
    }
    
    constructor() {}
    
    function playGame(uint256 choice) 
        external 
        payable 
        nonReentrant 
        validBet(msg.value)
        validChoice(choice)
    {
        uint256 gameId = gameCounter++;
        
        // Generate pseudo-random result using block properties
        uint256 result = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    msg.sender,
                    gameId,
                    blockhash(block.number - 1)
                )
            )
        ) % 2;
        
        bool won = (choice == result);
        uint256 payout = 0;
        
        if (won) {
            // Calculate payout with house edge
            uint256 grossPayout = msg.value * 2;
            uint256 houseFee = (grossPayout * HOUSE_EDGE) / 10000;
            payout = grossPayout - houseFee;
            
            // Transfer winnings to player
            (bool success, ) = payable(msg.sender).call{value: payout}("");
            require(success, "Payout failed");
        }
        
        // Store game data
        games[gameId] = Game({
            player: msg.sender,
            betAmount: msg.value,
            choice: choice,
            result: result,
            won: won,
            timestamp: block.timestamp,
            blockNumber: block.number
        });
        
        playerGames[msg.sender].push(gameId);
        
        emit GamePlayed(gameId, msg.sender, msg.value, choice, result, won, payout);
    }
    
    function getPlayerGames(address player) external view returns (uint256[] memory) {
        return playerGames[player];
    }
    
    function getGame(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function getGameStats() external view returns (uint256 totalGames, uint256 contractBalance) {
        return (gameCounter, address(this).balance);
    }
    
    // Owner functions
    function depositFunds() external payable onlyOwner {
        require(msg.value > 0, "Must deposit some funds");
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    function withdrawFunds(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
        emit FundsWithdrawn(msg.sender, amount);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
        emit FundsWithdrawn(msg.sender, balance);
    }
    
    // Allow contract to receive ETH
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}