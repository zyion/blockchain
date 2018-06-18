

module.exports = class TransactionInput {

    constructor (id, index, signature) {
        this.id = id; // previous transaction id
        this.index = index; // previous block index
        this.signature = signature; // hash of id
    }

    toString () {
        return '' + this.id + this.index;
    }

}
