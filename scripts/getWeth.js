const { ethers, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

async function getWeth() {
  console.log("Depositing Eth for Weth....");
  //abi
  //address
  const DEPOSIT_AMOUNT = ethers.parseEther("0.001");
  const chainId = network.config.chainId;
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  const wethAddress = networkConfig[chainId]["wethTokenAddress"];
  const wethContract = await ethers.getContractAt(
    "IWETH",
    wethAddress,
    deployer
  );
  const tx = await wethContract.deposit({ value: DEPOSIT_AMOUNT });
  await tx.wait(1);
  console.log("Eth Deposited!");
  console.log(
    `Current balance: ${ethers.formatEther(
      await wethContract.balanceOf(deployer)
    )} WETH `
  );
}

module.exports = { getWeth };
