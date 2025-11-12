export default class HttpError extends Error {
    public statusCode: number;
    constructor(statusCode = 500, messsege = "Internal Server Error") {
        super(messsege);
        this.statusCode = statusCode;
    }
}