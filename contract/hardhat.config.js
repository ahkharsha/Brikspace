require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = "Your Metamask Private";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    // hardhat: {
    //   chainId: 31337,
    // },
    polygon_amoy: {
      url: "https://12227332.rpc.thirdweb.com",
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};