// Buidler
const {task, types} = require("hardhat/config");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

// Libraries
const assert = require("assert");

// Process Env Variables
require("dotenv").config();

const ALCHEMY_ID = process.env.ALCHEMY_ID;
assert.ok(ALCHEMY_ID, "no Alchemy ID in process.env");
console.log(ALCHEMY_ID)
const COMPOUND_ADMIN = "0x6d903f6003cca6255d85cca4d3b5e5146dc33925";
const DAI_HOLDER = "0x250e76987d838a75310c34bf422ea9f1ac4cc906"


// ================================= CONFIG =========================================
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ID}`,
        blockNumber: 11219000,
      },
      blockGasLimit: 12500000,
      gas: 12500000,
      // allowUnlimitedContractSize: true,
      // Custom
      COMPOUND_ADMIN: COMPOUND_ADMIN,
      DAI_HOLDER: DAI_HOLDER,
      DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
      CDAI: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
      DssCdpManager: "0x5ef30b9986345249bc32d8928B7ee64DE9435E39",
      GetCdps: "0x36a724Bd100c39f0Ea4D3A20F7097eE01A8Ff573",
    }
  },
  solidity: {
    version: "0.5.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },

};


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

