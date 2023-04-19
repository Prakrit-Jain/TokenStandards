async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ERC721Token = await ethers.getContractFactory("ERC721");
    const ERC721token = await ERC721Token.deploy("my-nfttoken", "mnft");
  
    console.log("ERC721Token address:", ERC721token.address);
}

main()
.then(()=> process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1);
})