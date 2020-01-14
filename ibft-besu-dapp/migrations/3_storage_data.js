const StorageData = artifacts.require("StorageData");

module.exports = function(deployer) {
  deployer.deploy(StorageData);
};
