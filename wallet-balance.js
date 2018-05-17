const {
  getUnspentOutputs,
} = require('blockchain.info/blockexplorer').usingNetwork(3);

const computeBalance = async address => {
  const unspentOutputs = await getUnspentOutputs(address);

  const balanceInSatoshi = unspentOutputs.unspent_outputs.reduce(
    (sum, utxo) => sum + utxo.value,
    0,
  );

  const balanceInBTC = balanceInSatoshi / 100000000;

  console.log(`
Wallet: ${address}
Balance: ${balanceInBTC} BTC / ${balanceInSatoshi} satoshi
  `);
};

const [, , address] = process.argv;

computeBalance(address);
