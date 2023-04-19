async function main() {
  const TokenAddress = "0x81D0043Fa848D07A36899388E46765aeA0e11a6b";
  const MyContract = artifacts.require("ERC721");
  const abi = MyContract.abi;
  const [owner, user1, user2] = await ethers.getSigners();
  const tokenC = await ethers.getContractAt(abi, TokenAddress);
  console.log(await tokenC.name());
  console.log(await tokenC.symbol());
  await tokenC.connect(owner).mint(owner.address, 7);
  const bal1 = await tokenC.balanceOf(owner.address);
  console.log(bal1.toString());
  await tokenC.setApprovalForAll(user1.address, true);
  await tokenC.connect(user1).transferFrom(owner.address, user2.address, 7);
  console.log(await tokenC.balanceOf(owner.address));
  const bal2 = await tokenC.balanceOf(owner.address);
  const bal3 = await tokenC.balanceOf(user2.address);
  console.log(bal2.toString(), bal3.toString());
  await tokenC.connect(owner).mint(owner.address, 15);
  await tokenC
    .connect(user1)
    .safeTransferFrom(owner.address, user2.address, 15, "0x");
  console.log(await tokenC.ownerOf(15));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
