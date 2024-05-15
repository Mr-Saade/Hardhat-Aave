# Aave Project

This repository programmatically interacts with the Aave protocol for decentralized lending and borrowing.

## Overview

The project aims to demonstrate the following functionalities:

1. Programmatically depositing Ether (ETH) to mint Wrapped Ether (WETH) tokens.
2. Using the WETH tokens as collateral, depositing them into the Aave protocol lending pool to accumulate interest.
3. Borrowing a specific amount of DAI tokens as loan from the Aave protocol against the deposited collateral.
4. Repaying the borrowed DAI tokens.

## Features

- **Mainnet Forking**: Utilizes mainnet forking to interact with the mainnet Aave protocol and other mainnet contracts for local testing and development.
- **Asset Conversion with Chainlink Price Feeds**: Utilizes Chainlink's price feeds for asset conversion.

## Installation and Usage

### Prerequisites

# Getting Started

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`

## Quickstart

```bash
git clone https://github.com/Mr-Saade/Hardhat-Aave
cd Hardhat-Aave
yarn
```

### Usage

1. **Mainnet Forking Setup**:

   - Set up Hardhat to fork the Ethereum mainnet by providing a mainnet RPC URL in the `hardhat network configuration` of the `hardhat.config.js` file.

2. **Get WETH Tokens, Deposit, Borrow, and Repay**:
   - Run the `deposit-borrow` script located in the `scripts` folder:
     ```bash
     yarn hardhat run scripts/deposit-borrow.js
     ```
   - Ensure that you have a mainnet RPC URL in your env file.
