const { ethers } = require("hardhat");

async function main() {

    const tokenAddr = "0xb9A62F59F8c1359E24830e4FD209954E21B7DF37";
    const contract = artifacts.require("ERC20");
    const abi = contract.abi;
    const [owner, user1, user2] = await ethers.getSigners();
    const token = await ethers.getContractAt(abi, tokenAddr);
  
    console.log(await token.name());
    console.log(await token.symbol());
    console.log(await token.totalSupply());
    await token.transfer(user2.address, 200);
    const bal1 = await token.balanceOf(owner.address);
    console.log(bal1.toString());
    const bal2 = await token.balanceOf(user2.address);
    console.log(bal2.toString());
    await token.approve(user1.address, 100);
    const allowance = await token.allowance(owner.address, user1.address);
    console.log(allowance.toString());
    await token.connect(user1).transferFrom(owner.address, user2.address, 60);
    const bal3 = await token.balanceOf(owner.address)
    console.log(bal3.toString());
    const bal4 = await token.balanceOf(user2.address);
    console.log(bal4.toString());
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
})