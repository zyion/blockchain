
const Hash = require('./hash.js');
const Block = require('./block.js');

const genesisBlock = () => new Block(0, '0', 'Genesis Block');

const TRANSACTIONS_PER_BLOCK = 32;

module.exports = class Blockchain {

    constructor (chain) {
        this.chain = chain || [genesisBlock()];
        this.difficulty = 4;
        this.memPool = [];
        this.events = { };
    }

    on (event, callback) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(callback);
    }

    fire (event, data) {
        if (this.events.hasOwnProperty(event)) {
            for (let i in this.events[event])
            if (typeof this.events[event][i] === 'function') this.events[event][i](data);
        }
    }

    addTransaction (transaction) {

        // validate transaction

        this.memPool.push(transaction);
    }

    mine () {
        let transactions = this.memPool.splice(0, TRANSACTIONS_PER_BLOCK);

        // validate transactions

        let block = new Block(this.chain.length, this.chain[this.chain.length - 1].hash, transactions);
        block.mine(this.difficulty);
        if (this.isValidBlock(this.chain[this.chain.length - 1], block)) {
            this.chain.push(block);
            this.fire('block', block);
        } else console.log('block is invalid!');
    }

    isValidBlock (last, next) {
        if (last.index + 1 !== next.index) return false;
        else if (last.hash !== next.lastHash) return false;
        else if (next.hash !== Hash(next.toString())) return false;
        else if (!next.validHash(this.difficulty)) return false;
        else return true;
    }

    isValid () {
        for (let i = 1; i < this.chain.length; i++) {
            if (!this.isValidBlock(this.chain[i - 1], this.chain[i])) return false;
        }
        return true;
    }

}
