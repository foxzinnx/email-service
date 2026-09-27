import { DomainError } from "./domain.error.js";

export class SubjectCannotBeEmptyError extends DomainError {
    readonly code = 'SUBJECT_CANNOT_BE_EMPTY';

    constructor(){
        super('Subject cannot be empty');
        this.name = 'SubjectCannotBeEmptyError'
    }
}