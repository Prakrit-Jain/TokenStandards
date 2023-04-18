const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers");

let owner,
  addr1,
  addr2,
  Token,
  hardhatToken,
  ZeroAddress = "0x0000000000000000000000000000000000000000";

describe("ERC1155 contract", function () {
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("ERC1155");
    hardhatToken = await Token.deploy();
    await hardhatToken.mint(owner.address, 1, 100);
    await hardhatToken.mint(user1.address, 2, 200);
  });

  it("should check balances of any address", async function () {
    await expect(hardhatToken.balanceOf(ZeroAddress, 1)).to.be.revertedWith(
      "address zero is not a valid owner"
    );
    const balance = await hardhatToken.balanceOf(owner.address, 1);
    expect(balance).to.be.equal(100);
  });

  it("should check balances of batch of addresses", async function () {
    await expect(
      hardhatToken.balanceOfBatch([owner.address, user1.address], [1])
    ).to.be.revertedWith("accounts and ids length mismatch");
    const batchBalance = await hardhatToken.balanceOfBatch(
      [owner.address, user1.address],
      [1, 2]
    );
    const bal = batchBalance.toString();
    console.log(bal);
    expect(bal).to.equal('100,200');
    
  });

  it("should change approval for all assets to operator address", async function () {
    await expect(
      hardhatToken.setApprovalForAll(owner.address, true)
    ).to.be.revertedWith("setting approval status for self");
    expect(await hardhatToken.setApprovalForAll(user2.address, true)).to.be.ok;
  });

  it("should check approval for all assets", async function () {
    expect(
      await hardhatToken.isApprovedForAll(owner.address, user1.address)
    ).to.be.equal(false);
    await hardhatToken.setApprovalForAll(user2.address, true);
    expect(
      await hardhatToken.isApprovedForAll(owner.address, user2.address)
    ).to.be.equal(true);
  });

  it("should not mint to the zero address", async function () {
    await expect(hardhatToken.mint(ZeroAddress, 2, 100)).to.be.revertedWith(
      "can't mint to zero address"
    );
    await expect(
      hardhatToken.mintBatch(ZeroAddress, [1, 2], [10, 20])
    ).to.be.revertedWith("can't mint to zero address");
  });

  it("should mint desired value of tokens to 'to' address", async function () {
    await hardhatToken.mint(user2.address, 3, 300);
    const balance = await hardhatToken.balanceOf(user2.address, 3);
    expect(balance).to.be.equal(300);
  });

  it("should mint desired amount of tokens of given token ids for the address", async function () {
    await hardhatToken.mintBatch(user1.address, [1, 2], [10, 20]);
    const balance1 = await hardhatToken.balanceOf(user1.address, 1);
    const balance2 = await hardhatToken.balanceOf(user1.address, 2);
    expect(balance1).to.be.equal(10);
    expect(balance2).to.be.equal(220);
  });

  it("should safely transfer tokens to recipent address", async function () {
    await expect(
      hardhatToken.safeTransferFrom(owner.address, ZeroAddress, 1, 10, "0x")
    ).to.be.revertedWith("to cannot be zero address");
    await expect(
      hardhatToken
        .connect(user1)
        .safeTransferFrom(owner.address, user1.address, 1, 20, "0x")
    ).to.be.revertedWith("Not authorized to transfer");
    await expect(
        hardhatToken.safeTransferFrom(user2.address, user1.address, 1, 12, "0x")
      ).to.be.revertedWith("Not authorized to transfer");
    await hardhatToken.safeTransferFrom(owner.address, user2.address, 1, 60, "0x");
    const balanceOwner = await hardhatToken.balanceOf(owner.address, 1);
    const balanceUser2 = await hardhatToken.balanceOf(user2.address, 1);

    expect(balanceOwner).to.be.equal(40);
    expect(balanceUser2).to.be.equal(60);
  });

  it("should safely transfer tokens of given token ids in batch to recipent address", async function () {
    await expect(
      hardhatToken.safeBatchTransferFrom(owner.address, ZeroAddress, [1, 2], [5, 10], "0x")
    ).to.be.revertedWith("transfer to the zero address");
    await expect(
      hardhatToken
        .connect(user1)
        .safeBatchTransferFrom(owner.address, user1.address, [1, 2], [5, 10], "0x")
    ).to.be.revertedWith("Not authorized to transfer");
    await expect(
        hardhatToken.safeBatchTransferFrom(owner.address, user1.address, [1, 2], [5000, 10], "0x")
      ).to.be.revertedWith("insufficient balance for transfer");
    await hardhatToken.mint(owner.address, 3, 100); 
    await hardhatToken.safeBatchTransferFrom(owner.address, user2.address, [1, 3], [60, 70], "0x");
    const balanceOwner_1 = await hardhatToken.balanceOf(owner.address, 1);
    const balanceOwner_2 = await hardhatToken.balanceOf(owner.address, 3);
    const balanceUser2_1 = await hardhatToken.balanceOf(user2.address, 1);
    const balanceUser2_2 = await hardhatToken.balanceOf(user2.address, 3);

    expect(balanceOwner_1).to.be.equal(40);
    expect(balanceUser2_1).to.be.equal(60);
    expect(balanceOwner_2).to.be.equal(30);
    expect(balanceUser2_2).to.be.equal(70);
  });


});
