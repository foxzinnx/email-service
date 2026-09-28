export class FailedToSendEmailError extends Error {
    constructor(cause?: unknown){
        super('Failed to send email');
        this.name = "FailedToSendEmailError";
        this.cause = cause;
    }
}