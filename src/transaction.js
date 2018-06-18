
const Hash = require('./hash.js');


module.exports = class Transaction {

    constructor (inputs, outputs) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.setId();
    }

    toString () {
        return this.inputs.reduce((a, b) => a + b, '') + this.outputs.reduce((a, b) => a + b, '');
    }

    setId () {
        this.id = Hash(this.toString());
    }

}
