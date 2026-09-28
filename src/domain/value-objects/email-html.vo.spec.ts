import { describe, expect, it } from "vitest";
import { EmailHtml } from "./email-html.vo.js";
import { HtmlCannotBeEmptyError } from "../errors/html-cannot-be-empty.error.js";
import { HtmlIsTooLongError } from "../errors/html-is-too-long.error.js";

describe("EmailHtml VO", () => {
    describe("create", () => {
        it("should create a valid email html", () => {
            const html = EmailHtml.create("<p>Hello, this is the email html.</p>");

            expect(html.value).toBe("<p>Hello, this is the email html.</p>");
        });

        it("should trim leading and trailing whitespace", () => {
            const html = EmailHtml.create("   <p>Hello, this is the email html.</p>   ");

            expect(html.value).toBe("<p>Hello, this is the email html.</p>");
        });

        it("should preserve internal whitespace and newlines", () => {
            const content = "<div>\n  <p>Line 1</p>\n  <p>Line 2</p>\n</div>";
            const html = EmailHtml.create(content);

            expect(html.value).toBe(content);
        });

        it("should accept html with exactly MAX_LENGTH characters", () => {
            const content = "a".repeat(100_000);
            const html = EmailHtml.create(content);

            expect(html.value).toBe(content);
            expect(html.value.length).toBe(100_000);
        });

        it("should throw HtmlCannotBeEmptyError for empty string", () => {
            expect(() => EmailHtml.create("")).toThrow(HtmlCannotBeEmptyError);
        });

        it("should throw HtmlCannotBeEmptyError for whitespace-only string", () => {
            expect(() => EmailHtml.create("   ")).toThrow(HtmlCannotBeEmptyError);
            expect(() => EmailHtml.create("\n\t  \n")).toThrow(HtmlCannotBeEmptyError);
        });

        it("should throw HtmlIsTooLongError when html exceeds MAX_LENGTH", () => {
            const tooLong = "a".repeat(100_001);

            expect(() => EmailHtml.create(tooLong)).toThrow(HtmlIsTooLongError);
        });

        it("should throw HtmlIsTooLongError even after trimming if still too long", () => {
            const tooLong = "  " + "a".repeat(100_001) + "  ";

            expect(() => EmailHtml.create(tooLong)).toThrow(HtmlIsTooLongError);
        });
    });

    describe("value getter", () => {
        it("should expose the trimmed html", () => {
            const html = EmailHtml.create("  <p>Hello world</p>  ");

            expect(html.value).toBe("<p>Hello world</p>");
        });
    });

    describe("equals", () => {
        it("should return true for the same html content", () => {
            const html1 = EmailHtml.create("<p>Hello</p>");
            const html2 = EmailHtml.create("<p>Hello</p>");

            expect(html1.equals(html2)).toBe(true);
        });

        it("should return true when htmls differ only by leading/trailing whitespace", () => {
            const html1 = EmailHtml.create("  <p>Hello</p>  ");
            const html2 = EmailHtml.create("<p>Hello</p>");

            expect(html1.equals(html2)).toBe(true);
        });

        it("should return false for different html contents", () => {
            const html1 = EmailHtml.create("<p>Hello</p>");
            const html2 = EmailHtml.create("<p>World</p>");

            expect(html1.equals(html2)).toBe(false);
        });
    });
})