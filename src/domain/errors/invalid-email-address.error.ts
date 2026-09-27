import { DomainError } from "./domain.error.js";

export class InvalidEmailAddressError extends DomainError {
    readonly code = 'INVALID_EMAIL_ADDRESS';
    
    constructor(){
        super('Invalid email address');
        this.name = 'InvalidEmailAddressError';
    }
}