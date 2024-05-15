require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-network-helpers");

/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
      },
      {
        version: "0.6.12",
      },
    ],
  },

  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: process.env.MAINNET_RPC_URL,
      },
    },
  },
};
