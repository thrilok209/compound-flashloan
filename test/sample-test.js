const {expect} = require("chai");
const hre = require("hardhat");
const {deployments, ethers} = hre;

const IERC20_ABI = require("../pre-compiles/IERC20.json");
const ICDAI_ABI = require("../pre-compiles/ICDAI.json");

const DAI_HOLDER = "0x250e76987d838a75310c34bf422ea9f1ac4cc906"

const daiJoinAddress = ""
const potAddress = ""

const bytesDATA = "0x0000000000000000000000009759a6ac90977b93b58547b4a71c78317f391a28000000000000000000000000197e90f9fad81970ba7976f33cbd77088e5d7cf7"

describe("Greeter", function() {

  let daiInstance;

  let compoundAdmin;
  let daiHolder;
  
  let cdaiImplementationAddr;
  before(async function () {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [ hre.network.config.COMPOUND_ADMIN]}
    )

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [ hre.network.config.CDAI]}
    )

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [ DAI_HOLDER]}
    )

    daiInstance = await ethers.getContractAt(
      IERC20_ABI.abi,
      hre.network.config.DAI
    );

    cdaiInstance = await ethers.getContractAt(
      ICDAI_ABI.abi,
      hre.network.config.CDAI
    );

    daiHolder = await ethers.provider.getSigner(
      hre.network.config.DAI_HOLDER
    );

    compoundAdmin = await ethers.provider.getSigner(
      hre.network.config.COMPOUND_ADMIN
    );
  });

  it("Should return balance", async function() {
    // let balance = await daiInstance.connect(daiHolder).transfer(hre.network.config.CDAI, "1000000000000")
    let balance = await daiInstance.balanceOf(DAI_HOLDER)
    console.log((balance).toString())
  });

  it("Should sent balance to COMPOUND_ADMIN", async function() {
    await daiHolder.sendTransaction({
      to: hre.network.config.COMPOUND_ADMIN,
      value: ethers.utils.parseEther("1")
    });
  });

  it("Should deploy delegator", async function() {
    const Greeter = await ethers.getContractFactory("CDaiDelegate");
    // console.log(Greeter)
    const greeter = await Greeter.deploy();
    // console.log(greeter)
    var x = await greeter.deployed();

    cdaiImplementationAddr = x.address

  });

  it("Should set Implementation", async function() {
    console.log(cdaiImplementationAddr)
    console.log(await cdaiInstance.implementation())
    var z = await cdaiInstance.connect(compoundAdmin)._setImplementation(cdaiImplementationAddr, false, bytesDATA)

    console.log(await cdaiInstance.implementation())
    console.log(z)
  });

  it("Should give allowance", async function() {
    var z = await daiInstance.connect(compoundAdmin).approve(cdaiInstance.address, ethers.utils.parseEther("10000"))
    console.log(z)
  });

  it("Should take flashloan", async function() {
    var x = await cdaiInstance.connect(compoundAdmin).flashloan(ethers.utils.parseEther("100"))

    var logs = await web3.eth.getTransactionReceipt(x.hash)
    logs = logs.logs

    var transferHash = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    var filteredLogs = logs.filter(a => a.topics[0] === transferHash)
    console.log(filteredLogs)
  });
});
