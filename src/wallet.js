
const { ec } = require('elliptic');
const EC = new ec('ed25519');

const Transaction = require('./transaction.js');
const TransactionInput = require('./transactionInput.js');
const TransactionOutput = require('./transactionOutput.js');
const UTXO = require('./utxo.js');

module.exports = class Wallet {

    constructor (privateKey) {
        this.utxos = { };
        this.key = privateKey ? EC.keyFromPrivate(privateKey, 'hex') : EC.genKeyPair();
    }

    getPublicKey() {
        return this.key.getPublic().encode('hex');
    }

    sign (data) {
        return this.key.sign(data.toString('hex')).toDER();
    }

    verify (data, signature) {
        return this.key.verify(data, signature);
    }

    verifyPublic (data, publicKey, signature) {
        return EC.keyFromPublic(publicKey, 'hex').verify(data, signature);
    }

    getBalance () {
        let balance = 0;
        for (let i in this.utxos) {
            balance += this.utxos[i].amount;
        }
        return balance;
    }

    searchBlock (block) {
        for (let i in block.transactions) {
            let trx = block.transactions[i];
            for (let j in trx.outputs) {
                if (trx.outputs[j].address === this.getPublicKey()) { // received coins
                    this.utxos[trx.id] = new UTXO(trx.id, block.index, trx.outputs[j].address, trx.outputs[j].amount);
                }
            }
            for (let j in trx.inputs) { // utxo spent
                if (this.utxos[trx.inputs[j].id]) delete this.utxos[trx.inputs[j].id];
            }
        }
    }

    createTransaction (address, amount) {
        if (this.getBalance() >= amount) {
            let inputs = [];
            let outputs = [];
            let total = 0;
            while (total < amount) { // find utxos to spend
                let key = Object.keys(this.utxos)[0];
                let utxo = this.utxos[key];
                total += utxo.amount;
                inputs.push(new TransactionInput(utxo.id, utxo.index, this.sign(utxo.id)));
            }
            outputs.push(new TransactionOutput(address, amount));
            if (total > amount) { // return change from utxos
                outputs.push(new TransactionOutput(this.getPublicKey(), total - amount));
            }
            return new Transaction(inputs, outputs);
        } else return undefined;
    }

    findUTXO (blockchain) {
        for (let i in blockchain.chain) this.searchBlock(blockchain.chain[i]);
    }

}
