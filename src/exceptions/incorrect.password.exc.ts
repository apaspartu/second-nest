export default class IncorrectPasswordExc extends Error {
    constructor() {
        super();
        this.message = 'Incorrect password';
    }
}