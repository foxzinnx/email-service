import { DomainError } from "./domain.error.js";

export class BodyIsTooLongError extends DomainError {
    readonly code = 'BODY_IS_TOO_LONG';

    constructor(maxLength: number){
        super(`Body is too long (max ${maxLength} characters)`);
        this.name = 'BodyIsTooLongError';
    }
}