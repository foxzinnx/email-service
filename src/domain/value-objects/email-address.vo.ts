import { InvalidEmailAddressError } from "../errors/invalid-email-address.error.js";

export class EmailAddress {
    private readonly _value: string;
    
    private constructor(email: string){
        this._value = email;
    }

    static create(email: string): EmailAddress {
        return new EmailAddress(this.validate(email));
    }

    private static isValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    private static validate(email: string): string {
        if(typeof email !== "string"){
            throw new InvalidEmailAddressError();
        }

        const normalized = email.toLowerCase().trim();

        if(!this.isValid(normalized)){
            throw new InvalidEmailAddressError();
        }

        return normalized;
    }

    get value(): string {
        return this._value;
    }

    get domain(): string {
        return this._value.split("@")[1]!;
    }

    equals(other: EmailAddress): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}