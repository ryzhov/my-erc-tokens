import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
  // We define a fixture to reuse the same setup in every test.

  let yourContract: YourContract;
  before(async () => {
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await yourContractFactory.deploy(1000)) as YourContract;
    await yourContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the right symbol on deploy", async function () {
      expect(await yourContract.symbol()).to.equal("IWB");
    });

    it("Should allow read contract supply", async function () {
      expect(await yourContract.totalSupply()).to.equal(1000);
    });
  });
});
