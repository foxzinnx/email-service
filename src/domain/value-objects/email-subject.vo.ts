import { SubjectCannotBeEmptyError } from "../errors/subject-cannot-be-empty.error.js";
import { SubjectIsTooLongError } from "../errors/subject-is-too-long.error.js";

export class EmailSubject {
    private static readonly MAX_LENGTH = 200;
    private readonly _value: string;

    private constructor(subject: string){
        this._value = subject;
    }

    static create(subject: string): EmailSubject {
        return new EmailSubject(EmailSubject.validate(subject));
    }

    private static validate(subject: string){
        const trimmed = subject.trim();

        if(!trimmed){
            throw new SubjectCannotBeEmptyError();
        }

        if(trimmed.length > EmailSubject.MAX_LENGTH){
            throw new SubjectIsTooLongError(EmailSubject.MAX_LENGTH);
        }

        return trimmed;
    }

    get value(): string {
        return this._value;
    }

    equals(other: EmailSubject): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}