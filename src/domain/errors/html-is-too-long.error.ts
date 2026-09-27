import { DomainError } from "./domain.error.js";

export class HtmlIsTooLongError extends DomainError {
    readonly code = 'HTML_IS_TOO_LONG';

    constructor(maxLength: number){
        super(`Email html content cannot exceed ${maxLength} characters`);
        this.name = 'HtmlIsTooLongError';
    }
}