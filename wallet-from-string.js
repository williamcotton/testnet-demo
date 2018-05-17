const bitcoin = require('bitcoinjs-lib');
const bigi = require('bigi');

const { testnet } = bitcoin.networks;

const hash = bitcoin.crypto.sha256(Buffer.from('weedmaps'));
const d = bigi.fromBuffer(hash);

const keyPair = new bitcoin.ECPair(d, null, { network: testnet });
const address = keyPair.getAddress();

console.log(`\nWallet Address: ${address}`);

module.exports = { keyPair, address };
