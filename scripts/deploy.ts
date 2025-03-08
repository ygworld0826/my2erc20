import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractName = 'Mytoken';

  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy(deployer.address);

  await contract.waitForDeployment();

  console.log(`Contract deployed at: ${contract.target}`);
  await makeAbi(`${contractName}`, contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
