const { ethers } = require("hardhat");

async function main() {

    const tokenAddr = "0xd3aAA70197b22116c6732a964edC09C853AaC941";
    const contract = artifacts.require("ERC1155");
    const abi = contract.abi;

    const tokenC = await ethers.getContractAt(abi, tokenAddr);
    const [owner, user1, user2] =await ethers.getSigners();

    await tokenC.connect(owner).mint(owner.address, 1, 10);
    const bal1 = (await tokenC.balanceOf(owner.address, 1));
    console.log(bal1.toString());
    await tokenC.setApprovalForAll(user1.address, true);
    await tokenC.connect(user1).safeTransferFrom(owner.address, user2.address, 1, 4, "0x");
    const bal2 = await tokenC.balanceOf(owner.address, 1);
    const bal3 = await tokenC.balanceOf(user2.address, 1);
    console.log(bal2.toString(), bal3.toString());

}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
})