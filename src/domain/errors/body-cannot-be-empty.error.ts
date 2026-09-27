import { DomainError } from "./domain.error.js";

export class BodyCannotBeEmptyError extends DomainError {
    readonly code = 'BODY_CANNOT_BE_EMPTY';

    constructor(){
        super('Body cannot be empty');
        this.name = 'BodyCannotBeEmptyError';
    }
}