require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks:{
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [
        process.env.KEY,
      ],
      chainId: 44787,
    },
  },
  paths:{
    artifacts:"./src/artifacts"
  },
};
