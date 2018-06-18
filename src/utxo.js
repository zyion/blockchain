
module.exports = class UTXO {

    constructor (id, index, address, amount) {
        this.id = id;
        this.index = index;
        this.address = address;
        this.amount = amount;
    }

}
