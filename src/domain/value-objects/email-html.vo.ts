import { HtmlCannotBeEmptyError } from "../errors/html-cannot-be-empty.error.js";
import { HtmlIsTooLongError } from "../errors/html-is-too-long.error.js";

export class EmailHtml {
    private static readonly MAX_LENGTH = 100_000;
    private readonly _value: string;

    private constructor(html: string){
        this._value = html;
    }

    static create(html: string): EmailHtml {
        return new EmailHtml(EmailHtml.validate(html));
    }

    private static validate(html: string): string {
        const trimmed = html.trim();

        if(!trimmed){
            throw new HtmlCannotBeEmptyError();
        }

        if(trimmed.length > EmailHtml.MAX_LENGTH){
            throw new HtmlIsTooLongError(EmailHtml.MAX_LENGTH);
        }

        return trimmed;
    }

    get value(): string {
        return this._value;
    }

    equals(other: EmailHtml): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}