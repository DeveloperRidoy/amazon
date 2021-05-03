

class AppError extends Error {
    constructor (code, message) {
        super(Error);
        this.code = code;
        this.message = message;
    }
}

module.exports = AppError;