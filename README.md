# CryptoFlip - Decentralized Coinflip DApp

A fully decentralized coinflip gaming platform built with React, TypeScript, and Solidity smart contracts.

## Features

- **Provably Fair Gaming**: Uses blockchain randomization for transparent results
- **Instant Payouts**: Smart contract automatically pays winners
- **Web3 Integration**: Connect with MetaMask and other Web3 wallets
- **Real-time Updates**: Live game statistics and history
- **Responsive Design**: Works on desktop and mobile devices
- **2% House Edge**: Fair gaming with competitive odds

## Smart Contract Features

- Secure betting with minimum and maximum limits
- Pseudo-random number generation using block properties
- Automatic payouts with house edge calculation
- Game history and statistics tracking
- Owner functions for contract management
- Emergency withdrawal capabilities

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Web3**: Ethers.js for blockchain interaction
- **Smart Contracts**: Solidity with OpenZeppelin
- **Icons**: Lucide React
- **Animations**: CSS animations with Tailwind

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MetaMask or compatible Web3 wallet
- Access to Ethereum testnet/mainnet

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Smart Contract Deployment

1. Install Hardhat or Truffle for contract compilation
2. Deploy the `CoinFlip.sol` contract to your preferred network
3. Update the contract address in `src/hooks/useContract.ts`
4. Fund the contract with ETH for payouts

## Contract Security

- Uses OpenZeppelin's ReentrancyGuard for reentrancy protection
- Implements proper access controls with Ownable pattern
- Validates all inputs and betting amounts
- Uses safe transfer patterns for ETH handling

## Game Mechanics

- **Minimum Bet**: 0.001 ETH
- **Maximum Bet**: 1 ETH or 50% of contract balance
- **House Edge**: 2% (1.96x payout on wins)
- **Randomization**: Block properties ensure fairness

## Responsible Gaming

This platform is for educational purposes. Always:
- Gamble responsibly and within your means
- Verify contract addresses and audit smart contracts
- Understand the risks of cryptocurrency gaming
- Never bet more than you can afford to lose

## License

MIT License - see LICENSE file for details