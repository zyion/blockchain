
module.exports = class TransactionOutput {

    constructor (address, amount) {
        this.address = address;
        this.amount = amount;
    }

    toString () {
        return '' + this.address + this.amount;
    }

}
