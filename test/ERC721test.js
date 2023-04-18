const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  const { ethers } = require("hardhat");


let owner, user1, user2, token, hardhatToken, ZeroAddress = '0x0000000000000000000000000000000000000000';

describe("ERC721 contract", function() {

    beforeEach(async function() {
        [owner, user1, user2] = await ethers.getSigners();
        token = await ethers.getContractFactory("ERC721");
        hardhatToken = await token.deploy("nftoken", "mnft");
    });

    it("should assign name of nft", async function() {
        expect (await hardhatToken.name()).to.equal("nftoken");
    })

    it("should assign symbol of nft", async function() {
        expect (await hardhatToken.symbol()).to.be.equal("mnft");
    })
    
    describe("mint token", async function() {
        
        beforeEach(async function() {
            await hardhatToken.mint(owner.address, 1);
        })

        it("should not mint to the zero address", async function() {
            await expect(hardhatToken.mint(ZeroAddress, 2)).to.be.revertedWith("mint to the zero address");
        })

        it("should not mint already token", async function() {
            await expect(hardhatToken.mint(owner.address, 1)).to.be.revertedWith("token already minted");
        })
        
        it("should mint token to owners balance", async function() {
            const balance = await hardhatToken.balanceOf(owner.address);
            expect(balance).to.be.equal(1);
        })

        it("should assigned owner", async function() {
            expect(await hardhatToken.ownerOf(1)).to.equal(owner.address);
        })

        it("should approve a correct address for the token", async function() {
            await expect(hardhatToken.approve(owner.address, 1)).to.be.revertedWith("approval to current owner");
            await expect(hardhatToken.connect(user2).approve(user1.address, 1)).to.be.revertedWith("Not Authorized to approve");
            expect(await hardhatToken.approve(user1.address, 1)).to.be.ok;
        })

        it("should setApproval for all assets", async function() {
            await expect(hardhatToken.setApprovalForAll(owner.address,true)
            ).to.be.revertedWith("approve to caller");
            expect (await hardhatToken.setApprovalForAll(user1.address, true)).to.be.ok;
        })

        it("should transfer token to recipent address", async function() {
            await expect(hardhatToken.transferFrom(
                user2.address,
                user1.address,
                1
                )
            ).to.be.revertedWith("Owner not verified");
            await expect(hardhatToken.transferFrom(
                owner.address,
                ZeroAddress,
                1,
                )
            ).to.be.revertedWith("to cannot be zero address");
            await expect(hardhatToken.connect(user1).transferFrom(
                owner.address,
                user1.address,
                1,
                )
            ).to.be.revertedWith("Not authorized to transfer");
            await hardhatToken.transferFrom(owner.address, user2.address, 1);
            const balanceOwner = await hardhatToken.balanceOf(owner.address);
            const balanceUser2= await hardhatToken.balanceOf(user2.address);
            
            expect(balanceOwner).to.be.equal(0);
            expect(balanceUser2).to.be.equal(1);
            expect(await hardhatToken.ownerOf(1)).to.equal(user2.address);
            
        })

        it("should safely transfer token to recipent address", async function() {
            expect(await hardhatToken.safeTransferFrom(
                user2.address,
                user1.address,
                1
                )
            ).to.be.revertedWith("Owner not verified");

            await expect(hardhatToken.safeTransferFrom(
                owner.address,
                ZeroAddress,
                1
                )
            ).to.be.revertedWith("to cannot be zero address");
            await expect(hardhatToken.connect(user1).safeTransferFrom(
                owner.address,
                user1.address,
                1
                )
            ).to.be.revertedWith("Not authorized to transfer");
            await hardhatToken.safeTransferFrom(owner.address, user2.address, 1);
            const balanceOwner = await hardhatToken.balanceOf(owner.address);
            const balanceUser2= await hardhatToken.balanceOf(user2.address);
            
            expect(balanceOwner).to.be.equal(0);
            expect(balanceUser2).to.be.equal(1);
            expect(await hardhatToken.ownerOf(1)).to.equal(user2.address);
            
        });

        it("should getApproved address for the tooken id", async function() {
            await expect(hardhatToken.getApproved(2)).to.be.revertedWith("invalid token");
            await hardhatToken.approve(user1.address, 1);
            expect(await hardhatToken.getApproved(1)).to.be.equal(user1.address);
        })

        it("should check approval of all assets", async function() {
            await hardhatToken.setApprovalForAll(user1.address, true);
            expect (await hardhatToken.isApprovedForAll(owner.address, user1.address)).to.be.equal(true);
            expect (await hardhatToken.isApprovedForAll(owner.address, user2.address)).to.be.equal(false);
        })

    })
})
