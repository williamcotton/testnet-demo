const bitcoin = require('bitcoinjs-lib');

const { address, keyPair } = require('./wallet-from-string.js');

const { testnet } = bitcoin.networks;

const FEE = 1000;

const {
  getUnspentOutputs,
} = require('blockchain.info/blockexplorer').usingNetwork(3);
const { pushtx } = require('blockchain.info/pushtx').usingNetwork(3);

const testnetGraffiti = async message => {
  const unspentOutputs = await getUnspentOutputs(address);

  const unspent = {
    txId: unspentOutputs.unspent_outputs[0].tx_hash_big_endian,
    vout: unspentOutputs.unspent_outputs[0].tx_output_n,
    value: unspentOutputs.unspent_outputs[0].value,
  };

  const change = unspent.value - FEE;

  const txb = new bitcoin.TransactionBuilder(testnet);

  const data = Buffer.from(message, 'utf8');
  const dataScript = bitcoin.script.nullData.output.encode(data);

  txb.addInput(unspent.txId, unspent.vout);
  txb.addOutput(dataScript, 0);
  txb.addOutput(address, change);
  txb.sign(0, keyPair);

  const txHex = txb.build().toHex();
  const res = await pushtx(txHex);

  console.log(`
Message: ${message}
Transaction Fee: ${FEE} satoshi
Change: ${change} satoshi

blockchain.info posttx response: ${res}
  `);
};

const [, , ...messageArray] = process.argv;

const message = messageArray.join(' ');

testnetGraffiti(message);
