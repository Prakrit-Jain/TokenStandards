const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner, addr1, addr2, Token, hardhatToken, ZeroAddress = '0x0000000000000000000000000000000000000000';

describe("ERC20 TOKEN", function () {
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("ERC20");
    hardhatToken = await Token.deploy("my-token", "mkt", 1000);
  });

  it("should assign name of token at deployment", async function () {
    expect(await hardhatToken.name()).to.equal("my-token");
  });

  it("Deployment should assign synbol of tokens", async function () {
    expect(await hardhatToken.symbol()).to.equal("mkt");
  });

  it("should deploy the contract and assign total supply of tokens to the owner", async function () {
    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });

  it("should transfer tokens to recipent address", async function () {
    await expect(
      hardhatToken.transfer(ZeroAddress,100)
    ).to.be.revertedWith('Transfer to Zero Address');
    await expect(
        hardhatToken.transfer(addr1.address, 1001)
    ).to.be.revertedWith("No Sufficient Balance");
    await hardhatToken.transfer(addr1.address, 10);
    expect(await hardhatToken.balanceOf(addr1.address)).to.be.equal(10);
    expect(await hardhatToken.balanceOf(owner.address)).to.be.equal(990);
    expect(await hardhatToken.totalSupply()).to.be.equal(1000);
  });

  it("should approve a spender account with desired tokens to be spend", async function () {
    await expect(
      hardhatToken.approve(ZeroAddress, 100)
    ).to.be.revertedWith('spender cannot be the zero address.');
    await hardhatToken.approve(addr1.address, 50);
    expect(
      await hardhatToken.allowance(owner.address, addr1.address)
    ).to.be.equal(50);
  });

  it("should transfer tokens from one account to another where only the approved spender can do the same", async function () {
    expect(
      hardhatToken.transferFrom(ZeroAddress, addr1.address, 70)
    ).to.be.revertedWith('Transfer from Zero Address');
    expect(
      hardhatToken.transferFrom(owner.address, ZeroAddress, 70)
    ).to.be.revertedWith('Transfer from Zero Address');
    await hardhatToken.transfer(addr1.address, 100);
    await hardhatToken.approve(addr1.address, 110);
    expect(
      hardhatToken.connect(addr1).transferFrom(owner.address, owner.address, 70)
    ).to.be.revertedWith("Same address Transfers");
    await expect(
     hardhatToken
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, 120)
    ).to.be.revertedWith("Not Enough Allowance");

    await hardhatToken
      .connect(addr1)
      .transferFrom(owner.address, addr2.address, 70);
    expect(await hardhatToken.balanceOf(addr2.address)).to.be.equal(70);

    await hardhatToken.approve(addr1.address, 2000);
    await expect(
        hardhatToken
           .connect(addr1)
           .transferFrom(owner.address, addr2.address, 1200)
       ).to.be.revertedWith("Not enough balance in owners account");

  });

  it("should mint desired no. of tokens ", async function () {
    await hardhatToken.mint(400);
    expect(await hardhatToken.totalSupply()).to.be.equal(1400);
    await expect(
        hardhatToken.connect(addr1).mint(400)
    ).to.be.revertedWith("Not a owner");
      
  });

  it("should burn desired no. of tokens ", async function () {
    await hardhatToken.burn(400);
    expect(await hardhatToken.totalSupply()).to.be.equal(600);
    await expect(
        hardhatToken.connect(addr1).burn(400)
    ).to.be.revertedWith("Not a owner");
    await expect(
        hardhatToken.burn(1400)
    ).to.be.revertedWith("Burn amount exceeds balance");
    
  });

  it("should transfer ownership to temporary owner", async function() {
    await expect(
      hardhatToken.temporaryOwner(ZeroAddress)
      ).to.be.revertedWith("Ownership can't be transfered to zero address");
    await expect(
      hardhatToken.connect(addr1).mint(100)
      ).to.be.revertedWith('Not a owner');
    await expect(
      hardhatToken.connect(addr1).temporaryOwner(addr2.address)
      ).to.be.revertedWith('Not a owner');
    await hardhatToken.temporaryOwner(addr1.address);
    expect (await hardhatToken.connect(addr1).mint(100)).to.be.ok;  
  })

});
