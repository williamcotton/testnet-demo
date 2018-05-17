const bitcoin = require('bitcoinjs-lib');

const { testnet } = bitcoin.networks;

const keyPair = bitcoin.ECPair.fromWIF(
  '931rbskhhrnucNt2aruPYNnVEhNk8en3j3GuzvuSK9HUAnLbxkQ',
  testnet,
);
const address = keyPair.getAddress();

console.log(`Wallet Address: ${address}`);

module.exports = { keyPair, address };
