import { describe, expect, it } from "vitest";
import { EmailBody } from "./email-body.vo.js";
import { BodyCannotBeEmptyError } from "../errors/body-cannot-be-empty.error.js";
import { BodyIsTooLongError } from "../errors/body-is-too-long.error.js";

describe("Email Body VO", () => {
    describe("create", () => {
        it("should create a valid email body", () => {
            const body = EmailBody.create("Este é um body do email");

            expect(body.value).toBe("Este é um body do email");
        });

        it("should trim whitespace", () => {
            const body = EmailBody.create("    Este é um body   ");

            expect(body.value).toBe("Este é um body");
        });

        it("should preserve internal whitespace and newlines", () => {
            const content = "Linha 1\n\nLinha 2\n tudo certo";
            const body = EmailBody.create(content);

            expect(body.value).toBe(content);
        });

        it("should accept body with exactly MAX_LENGTH characters", () => {
            const content = "a".repeat(50_000);
            const body = EmailBody.create(content);

            expect(body.value).toBe(content);
            expect(body.value.length).toBe(50_000);
        });

        it("should throw BodyCannotBeEmptyError for empty string", () => {
            expect(() => EmailBody.create("")).toThrow(BodyCannotBeEmptyError);
            expect(() => EmailBody.create("\n\t  \n")).toThrow(BodyCannotBeEmptyError);
        });

        it("should throw BodyCannotBeEmptyError for whitespace-only string", () => {
            expect(() => EmailBody.create("   ")).toThrow(BodyCannotBeEmptyError);
            expect(() => EmailBody.create("\n\t  \n")).toThrow(BodyCannotBeEmptyError);
        });

        it("should throw BodyIsTooLongError when body exceeds MAX_LENGTH", () => {
            const tooLong = "a".repeat(50_001);

            expect(() => EmailBody.create(tooLong)).toThrow(BodyIsTooLongError);
        });

        it("should throw BodyIsTooLongError even after trimming if still too long", () => {
            const tooLong = "  " + "a".repeat(50_001) + "  ";

            expect(() => EmailBody.create(tooLong)).toThrow(BodyIsTooLongError);
        });
    });

    describe("value getter", () => {
        it("should expose the trimmed body", () => {
            const body = EmailBody.create("  Hello world  ");

            expect(body.value).toBe("Hello world");
        });
    });

    describe("equals", () => {
        it("should return true for the same body content", () => {
            const body1 = EmailBody.create("Hello");
            const body2 = EmailBody.create("Hello");

            expect(body1.equals(body2)).toBe(true);
        });

        it("should return true when bodies differ only by leading/trailing whitespace", () => {
            const body1 = EmailBody.create("  Hello  ");
            const body2 = EmailBody.create("Hello");

            expect(body1.equals(body2)).toBe(true);
        });

        it("should return false for different body contents", () => {
            const body1 = EmailBody.create("Hello");
            const body2 = EmailBody.create("World");

            expect(body1.equals(body2)).toBe(false);
        });
    });
})