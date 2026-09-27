import { DomainError } from "./domain.error.js";

export class SubjectIsTooLongError extends DomainError {
    readonly code = 'SUBJECT_IS_TOO_LONG';

    constructor(maxLength: number){
        super(`Subject is too long (max ${maxLength} characters)`);
        this.name = 'SubjectIsTooLongError'
    }
}