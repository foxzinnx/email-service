import { BodyCannotBeEmptyError } from "../errors/body-cannot-be-empty.error.js";
import { BodyIsTooLongError } from "../errors/body-is-too-long.error.js";

export class EmailBody {
    private static readonly MAX_LENGTH = 50_000;
    private readonly _value: string;

    private constructor(body: string){
        this._value = body;
    }

    static create(body: string): EmailBody {
        return new EmailBody(EmailBody.validate(body));
    }

    private static validate(body: string){
        const trimmed = body.trim();

        if(!trimmed){
            throw new BodyCannotBeEmptyError();
        }

        if(trimmed.length > EmailBody.MAX_LENGTH){
            throw new BodyIsTooLongError(EmailBody.MAX_LENGTH);
        }

        return trimmed;
    }

    get value(): string {
        return this._value;
    }

    equals(other: EmailBody): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}