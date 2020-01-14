const Web3 = require("web3");
const EEAClient = require("web3-eea");

const { orion, besu } = require("../keys.js");

const StorageContract = require ('../build/contracts/StorageData.json');
console.log(StorageContract.bytecode);
const abi = StorageContract.abi;
const binary = StorageContract.bytecode;
  

const web3 = new EEAClient(new Web3(besu.node1.url), 2018);
new web3.eth.Contract(abi);

const createPrivateEmitterContract = () => {
  const contractOptions = {
    data: `${binary}`,
    privateFrom: orion.node1.publicKey,
    privateFor: [orion.node2.publicKey],
    privateKey: besu.node1.privateKey
  };
  return web3.eea.sendRawTransaction(contractOptions);
};

const getPrivateContractAddress = transactionHash => {
  console.log("Transaction Hash ", transactionHash);
  return web3.priv
    .getTransactionReceipt(transactionHash, orion.node1.publicKey)
    .then(privateTransactionReceipt => {
      console.log("Private Transaction Receipt\n", privateTransactionReceipt);
      return privateTransactionReceipt.contractAddress;
    });
};

const storeValue = (contractAddress, name, id) => {
  const functionAbi = abi.find(e => {
    return e.name === "set";
  });
  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [name, id])
    .slice(2);
  console.log("contract address: " + contractAddress)
  const functionCall = {
    to: contractAddress,
    data: functionAbi.signature + functionArgs,
    privateFrom: orion.node1.publicKey,
    privateFor: [orion.node2.publicKey],
    privateKey: besu.node1.privateKey
  };
  console.log("functionCall : ", functionCall)
  return web3.eea.sendRawTransaction(functionCall);
};

const getValue = contractAddress => {
  const functionAbi = abi.find(e => {
    return e.name === "read";
  });

  const functionCall = {
    to: contractAddress,
    data: functionAbi.signature,
    privateFrom: orion.node1.publicKey,
    privateFor: [orion.node2.publicKey],
    privateKey: besu.node1.privateKey
  };

  return web3.eea
    .sendRawTransaction(functionCall)
    .then(transactionHash => {
      return web3.priv.getTransactionReceipt(
        transactionHash,
        orion.node1.publicKey
      );
    })
    .then(result => {
      console.log('Result CALL GET: ', result);
      return result.output;
    });
};

const getPrivateTransactionReceipt = transactionHash => {
  return web3.priv
    .getTransactionReceipt(transactionHash, orion.node1.publicKey)
    .then(result => {
      console.log("Result: ",result)
      console.log("Transaction Hash:", transactionHash);
      console.log("Event Emited:", result.logs[0].data);
      return result;
    });
};

createPrivateEmitterContract()
  .then(getPrivateContractAddress)
  .then(contractAddress => {
    return storeValue(contractAddress, "WNET", 15)
      .then(transactionHash => {
        return getPrivateTransactionReceipt(transactionHash);
      })
      .then(() => {
        return getValue(contractAddress);
      })
      .then(() => {
        return storeValue(contractAddress, "COOP", 22);
      })
      .then(transactionHash => {
        return getPrivateTransactionReceipt(transactionHash);
      })
      .then(() => {
        return getValue(contractAddress);
      });
  })
  .catch(console.log);