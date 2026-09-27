import { DomainError } from "./domain.error.js";

export class HtmlCannotBeEmptyError extends DomainError {
    readonly code = 'HTML_CANNOT_BE_EMPTY';

    constructor(){
        super('Email html content cannot be empty when provided');
        this.name = 'HtmlCannotBeEmptyError';
    }
}