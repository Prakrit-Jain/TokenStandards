require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("@nomiclabs/hardhat-truffle5")

const { ALCHEMY_API_KEY, SEPOLIA_PRIVATE_KEY, KEY } = process.env;
module.exports = {

  solidity: "0.8.19",
  nameAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${KEY}`,
      }
    },
    sepolia: {
          url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
          accounts: [SEPOLIA_PRIVATE_KEY]
        }
    }
  };

