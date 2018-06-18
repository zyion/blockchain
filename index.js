

const Wallet = require('./src/wallet.js');
const Block = require('./src/block.js');
const Blockchain = require('./src/blockchain.js');
const Transaction = require('./src/transaction.js');
const TransactionOutput = require('./src/transactionOutput.js');
const TransactionInput = require('./src/transactionInput.js');


let blockchain = new Blockchain();


// public key: 0431ba7ea2f19183140f281015be2bf227a41129a4983e7d8f32bb75e379e21a80408b98b9edb5ef5c190c99b59b74d81cc04826f23191e2888b03aaac5815cd77
// private key: 0d4bace9e969f8b9e2addf36c41968400a93b6ff79959f6a518976b948cc7fae
let wallet = new Wallet('0d4bace9e969f8b9e2addf36c41968400a93b6ff79959f6a518976b948cc7fae');


let input = new TransactionInput();
let output = new TransactionOutput('0431ba7ea2f19183140f281015be2bf227a41129a4983e7d8f32bb75e379e21a80408b98b9edb5ef5c190c99b59b74d81cc04826f23191e2888b03aaac5815cd77', 100);
let transaction = new Transaction([input], [output]);
blockchain.addTransaction(transaction);


blockchain.on('block', block => {
    wallet.searchBlock(block);
    console.log('Wallet 1 balance', wallet.getBalance());
});

blockchain.mine();



let w = new Wallet();
let trx = wallet.createTransaction(w.getPublicKey(), 20);
if (trx) blockchain.addTransaction(trx);

blockchain.mine();

w.findUTXO(blockchain);
console.log('Wallet 2 balance', w.getBalance());

console.log('blockchain is valid', blockchain.isValid());
