async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const ERC20Token = await ethers.getContractFactory("ERC20");
  const ERC20token = await ERC20Token.deploy("my-token", "mkt", 1000);

  console.log("ERC20Token address:", ERC20token.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
})