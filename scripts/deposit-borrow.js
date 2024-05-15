const { getWeth } = require("./getWeth");
const { ethers, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const chainId = network.config.chainId;
const DEPOSIT_AMOUNT = ethers.parseEther("0.001");
const wethAddress = networkConfig[chainId]["wethTokenAddress"];

let lendingPoolAddress, deployer, lendingPool;

async function main() {
  const accounts = await ethers.getSigners();
  deployer = accounts[0];
  await getWeth();

  lendingPool = await getLendingPool();

  await approveERC20(
    "IWETH",
    wethAddress,
    deployer,
    lendingPoolAddress,
    DEPOSIT_AMOUNT
  );

  const txDeposit = await lendingPool.deposit(
    wethAddress,
    DEPOSIT_AMOUNT,
    deployer,
    0
  );
  await txDeposit.wait(1);
  console.log(`Deposited ${ethers.formatEther(DEPOSIT_AMOUNT)} Successfully`);
  console.log("-----------------------------------");
  console.log("Borrowing Transaction initiated!");
  const availableBorrowsETH = await getUserAccountInfo();
  const daiEthPrice = await getDaiConversion();
  const availableBorrowsDai =
    availableBorrowsETH.toString() * (1 / daiEthPrice.toString());
  console.log(`Available Borrows DAI: ${availableBorrowsDai}`);
  const borrowAmountETH = availableBorrowsETH.toString() * 0.95;
  const borrowAmountDai =
    borrowAmountETH.toString() * (1 / daiEthPrice.toString());
  const borrowAmountDaiWei = ethers.parseEther(borrowAmountDai.toString());

  const daiAddress = networkConfig[chainId]["daiAddress"];
  console.log(`Borrowing ${borrowAmountDai} of Dai tokens...`);

  const borrowTx = await lendingPool.borrow(
    daiAddress,
    borrowAmountDaiWei,
    2,
    0,
    deployer
  );
  await borrowTx.wait(1);
  const endingavailableBorrowsETH = await getUserAccountInfo();
  const endingavailableBorrowsDAI =
    endingavailableBorrowsETH.toString() * (1 / daiEthPrice.toString());
  console.log(`Available Borrows DAI: ${endingavailableBorrowsDAI}`);
  console.log("Borrow Successful!");
  console.log("Do not forget to repay loan, Thank you. ");

  await approveERC20(
    "IERC20",
    daiAddress,
    deployer,
    lendingPoolAddress,
    borrowAmountDaiWei
  );
  const repayTx = await lendingPool.repay(
    daiAddress,
    borrowAmountDaiWei,
    2,
    deployer
  );
  await repayTx.wait(1);
  console.log("Repaid, Thank you.");
  await getUserAccountInfo();
}

async function approveERC20(IERC20, tokenAddress, signer, spender, amount) {
  const contract = await ethers.getContractAt(IERC20, tokenAddress, signer);
  const approveTx = await contract.approve(spender, amount);
  await approveTx.wait(1);
  console.log("Approved!");
}
async function getDaiConversion() {
  console.log("Getting rate of dai per eth...");
  const daiEth = networkConfig[chainId]["daiEth"];
  const priceFeeds = await ethers.getContractAt(
    "AggregatorV3Interface",
    daiEth
  );
  const daiEthPrice = (await priceFeeds.latestRoundData())[1];
  console.log(`EthToDai Price: ${daiEthPrice.toString()}`);
  return daiEthPrice;
}
async function getUserAccountInfo() {
  console.log("Getting user account info...");
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(deployer);
  console.log(
    `Total Collateral ETH: ${ethers.formatEther(totalCollateralETH)}`
  );
  console.log(`Total Debt ETH: ${ethers.formatEther(totalDebtETH)}`);
  console.log(
    `Available Borrows ETH: ${ethers.formatEther(availableBorrowsETH)}`
  );
  return availableBorrowsETH;
}

async function getLendingPool() {
  console.log("Getting Lending Pool Address...");

  const lendingPoolAddressesProvider = await networkConfig[chainId][
    "IlendingPoolProviderAddress"
  ];

  const lendingPoolProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    lendingPoolAddressesProvider,
    deployer
  );
  lendingPoolAddress = await lendingPoolProvider.getLendingPool();
  console.log(`Lending Pool Address: ${lendingPoolAddress}`);

  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    deployer
  );
  return lendingPool;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
