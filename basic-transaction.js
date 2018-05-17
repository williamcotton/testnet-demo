const bitcoin = require('bitcoinjs-lib');

const { address, keyPair } = require('./wallet-from-string.js');

const { testnet } = bitcoin.networks;

const FEE = 1000;

const {
  getUnspentOutputs,
} = require('blockchain.info/blockexplorer').usingNetwork(3);
const { pushtx } = require('blockchain.info/pushtx').usingNetwork(3);

const createAndSendTransaction = async ({ sendToAddress, amountToSend }) => {
  const unspentOutputs = await getUnspentOutputs(address);

  const txb = new bitcoin.TransactionBuilder(testnet);

  const unspent = {
    txId: unspentOutputs.unspent_outputs[0].tx_hash_big_endian,
    vout: unspentOutputs.unspent_outputs[0].tx_output_n,
    value: unspentOutputs.unspent_outputs[0].value,
  };

  const change = unspent.value - amountToSend - FEE;

  txb.addInput(unspent.txId, unspent.vout);
  txb.addOutput(sendToAddress, amountToSend);
  txb.addOutput(address, change);
  txb.sign(0, keyPair);

  const txHex = txb.build().toHex();
  const res = await pushtx(txHex);

  console.log(`
Send to Wallet: ${sendToAddress}
Amount to Send: ${amountToSend} satoshi
Transaction Fee: ${FEE} satoshi
Change: ${change} satoshi

blockchain.info posttx response: ${res}
  `);
};

const [, , sendToAddress, amountToSendString] = process.argv;

const amountToSend = parseInt(amountToSendString, 10);

createAndSendTransaction({ sendToAddress, amountToSend });
