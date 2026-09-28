import { describe, expect, it } from "vitest";
import { EmailAddress } from "./email-address.vo.js";
import { InvalidEmailAddressError } from "../errors/invalid-email-address.error.js";

describe("Email Address VO", () => {
    describe("create", () => {
        it("should create a valid email address", () => {
            const email = EmailAddress.create("bryan@gmail.com");

            expect(email.value).toBe("bryan@gmail.com");
        });

        it("should normalize email to lowercase", () => {
            const email = EmailAddress.create("Bryan@Gmail.com");

            expect(email.value).toBe("bryan@gmail.com");
        });

        it("should trim whitespace", () => {
            const email = EmailAddress.create("   bryan@gmail.com    ");

            expect(email.value).toBe("bryan@gmail.com");
        });

        it("should accept email with subdomain", () => {
            const email = EmailAddress.create("bryan@sub.domain.com");

            expect(email.value).toBe("bryan@sub.domain.com");
        });

        it("should accept email with plus addressing", () => {
            const email = EmailAddress.create("user+tag@gmail.com");

            expect(email.value).toBe("user+tag@gmail.com");
        });

        it("should throw InvalidEmailAddressError for non-string value", () => {
            expect(() => EmailAddress.create(123 as any)).toThrow(InvalidEmailAddressError);
            expect(() => EmailAddress.create(null as any)).toThrow(InvalidEmailAddressError);
            expect(() => EmailAddress.create(undefined as any)).toThrow(InvalidEmailAddressError);
        });

        it("should throw InvalidEmailAddressError for empty string", () => {
            expect(() => EmailAddress.create("")).toThrow(InvalidEmailAddressError);
            expect(() => EmailAddress.create("   ")).toThrow(InvalidEmailAddressError);
        });

        it("should throw InvalidEmailAddressError for missing @", () => {
            expect(() => EmailAddress.create("userexample.com")).toThrow(InvalidEmailAddressError);
        });

        it("should throw InvalidEmailAddressError for missing domain", () => {
            expect(() => EmailAddress.create("user@")).toThrow(InvalidEmailAddressError);
        });

        it("should throw InvalidEmailAddressError for missing local part", () => {
            expect(() => EmailAddress.create("@example.com")).toThrow(InvalidEmailAddressError);
        });

        it("should throw InvalidEmailAddressError for missing TLD", () => {
            expect(() => EmailAddress.create("user@example")).toThrow(InvalidEmailAddressError);
        });

        it("should throw InvalidEmailAddressError for spaces in the middle", () => {
            expect(() => EmailAddress.create("user @example.com")).toThrow(InvalidEmailAddressError);
            expect(() => EmailAddress.create("user@ example.com")).toThrow(InvalidEmailAddressError);
        });
    });

    describe("domain", () => {
        it("should return the domain part", () => {
            const email = EmailAddress.create("user@example.com");

            expect(email.domain).toBe("example.com");
        });

        it("should return subdomain correctly", () => {
            const email = EmailAddress.create("user@mail.example.com");

            expect(email.domain).toBe("mail.example.com");
        });
    });

    describe("equals", () => {
        it("should return true for the same email address", () => {
            const email1 = EmailAddress.create("user@example.com");
            const email2 = EmailAddress.create("user@example.com");

            expect(email1.equals(email2)).toBe(true);
        });

        it("should return true when emails differ only by case or whitespace", () => {
            const email1 = EmailAddress.create("User@Example.COM");
            const email2 = EmailAddress.create("  user@example.com  ");

            expect(email1.equals(email2)).toBe(true);
        });

        it("should return false for different email addresses", () => {
            const email1 = EmailAddress.create("user@example.com");
            const email2 = EmailAddress.create("other@example.com");

            expect(email1.equals(email2)).toBe(false);
        });
    });
})