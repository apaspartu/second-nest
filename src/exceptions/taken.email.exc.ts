export default class TakenEmailException extends Error {
    constructor() {
        super();
        this.message = 'This email already taken';
    }
}