const fs = require('fs');
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    lacchain: {
      provider: () =>
        new HDWalletProvider(
          '8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63',
          'http://192.168.0.78:8545'
        ),
      network_id: 2018,
      gasPrice: 0
    }
  }
}
