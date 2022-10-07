export default class SomethingWrongExc extends Error {
    constructor() {
        super();
        this.message = 'Something went wrong';
    }
}