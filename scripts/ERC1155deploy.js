async function main() {
    const [deployer] = ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ERC1155Token = await ethers.getContractFactory("ERC721");
    const ERC1155token = await ERC1155Token.deploy();

    console.log("ERC1155Token address:", ERC1155token.address);
}