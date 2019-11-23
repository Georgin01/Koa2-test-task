function convert(message) {
    let textMsg = '';
    if (typeof message === 'object') {
        try {
            textMsg += JSON.stringify(message);
        } catch (e) {
            textMsg += 'recursive link in message';
        }
    } else {
        textMsg += message;
    }
    return textMsg;
}

class BadRequestError extends Error {
    constructor(message) {
        const textMsg = `Error: BadRequestError\n${convert(message)}`;
        super(textMsg);
        this.status = 400;
        this.expose = true;
    }
}

module.exports = {
    BadRequestError
};