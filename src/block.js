

const Hash = require('./hash.js');


module.exports = class Block {

    constructor (index, lastHash, transactions) {
        this.index = index;
        this.timestamp = Date.now();
        this.lastHash = lastHash;
        this.transactions = transactions;
        this.nonce = 0;
        this.hash = Hash(this.toString());
    }

    toString () {
        return this.index + this.lastHash + this.timestamp + this.transactions + this.nonce;
    }

    validHash (difficulty) {
        return this.hash.substr(0, difficulty) === '0'.repeat(difficulty);
    }

    mine (difficulty) {
        while (!this.validHash(difficulty)) {
            this.nonce++;
            this.hash = Hash(this.toString());
        }
    }

}
