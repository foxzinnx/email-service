import { describe, it, expect } from "vitest";
import { EmailSubject } from "./email-subject.vo.js";
import { SubjectCannotBeEmptyError } from "../errors/subject-cannot-be-empty.error.js";
import { SubjectIsTooLongError } from "../errors/subject-is-too-long.error.js";

describe("EmailSubject", () => {
    describe("create", () => {
        it("should create a valid email subject", () => {
            const subject = EmailSubject.create("Welcome to our platform");

            expect(subject.value).toBe("Welcome to our platform");
        });

        it("should trim leading and trailing whitespace", () => {
            const subject = EmailSubject.create("   Welcome to our platform   ");

            expect(subject.value).toBe("Welcome to our platform");
        });

        it("should preserve internal whitespace", () => {
            const content = "Hello   World";
            const subject = EmailSubject.create(content);

            expect(subject.value).toBe(content);
        });

        it("should accept subject with exactly MAX_LENGTH characters", () => {
            const content = "a".repeat(200);
            const subject = EmailSubject.create(content);

            expect(subject.value).toBe(content);
            expect(subject.value.length).toBe(200);
        });

        it("should throw SubjectCannotBeEmptyError for empty string", () => {
            expect(() => EmailSubject.create("")).toThrow(SubjectCannotBeEmptyError);
        });

        it("should throw SubjectCannotBeEmptyError for whitespace-only string", () => {
            expect(() => EmailSubject.create("   ")).toThrow(SubjectCannotBeEmptyError);
            expect(() => EmailSubject.create("\n\t  \n")).toThrow(SubjectCannotBeEmptyError);
        });

        it("should throw SubjectIsTooLongError when subject exceeds MAX_LENGTH", () => {
            const tooLong = "a".repeat(201);

            expect(() => EmailSubject.create(tooLong)).toThrow(SubjectIsTooLongError);
        });

        it("should throw SubjectIsTooLongError even after trimming if still too long", () => {
            const tooLong = "  " + "a".repeat(201) + "  ";

            expect(() => EmailSubject.create(tooLong)).toThrow(SubjectIsTooLongError);
        });
    });

    describe("value getter", () => {
        it("should expose the trimmed subject", () => {
            const subject = EmailSubject.create("  Hello world  ");

            expect(subject.value).toBe("Hello world");
        });
    });

    describe("equals", () => {
        it("should return true for the same subject content", () => {
            const subject1 = EmailSubject.create("Hello");
            const subject2 = EmailSubject.create("Hello");

            expect(subject1.equals(subject2)).toBe(true);
        });

        it("should return true when subjects differ only by leading/trailing whitespace", () => {
            const subject1 = EmailSubject.create("  Hello  ");
            const subject2 = EmailSubject.create("Hello");

            expect(subject1.equals(subject2)).toBe(true);
        });

        it("should return false for different subject contents", () => {
            const subject1 = EmailSubject.create("Hello");
            const subject2 = EmailSubject.create("World");

            expect(subject1.equals(subject2)).toBe(false);
        });
    });
});