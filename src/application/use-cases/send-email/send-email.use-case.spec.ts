import { beforeEach, describe, expect, it } from "vitest";
import type { EmailSenderProvider } from "../../ports/email-sender-provider.interface.js";
import type { Email } from "../../../domain/entities/email.entity.js";
import { SendEmailUseCase } from "./send-email.use-case.js";
import { SubjectCannotBeEmptyError } from "../../../domain/errors/subject-cannot-be-empty.error.js";

class FakeEmailSenderProvider implements EmailSenderProvider {
    public sent: Email[] = [];
    
    async send(email: Email): Promise<void> {
        this.sent.push(email);
    }
}

describe("SendEmailUseCase", () => {
    let emailSender: FakeEmailSenderProvider;
    let sut: SendEmailUseCase;

    const validInput = {
        from: "sender@email.com",
        to: "receiver@email.com",
        subject: "Hello",
        body: "Some content."
    }

    beforeEach(() => {
        emailSender = new FakeEmailSenderProvider();
        sut = new SendEmailUseCase(emailSender);
    });

    it("should send a valid email", async () => {
        await sut.execute(validInput);

        expect(emailSender.sent).toHaveLength(1);
        expect(emailSender.sent[0]?.subject.value).toBe("Hello");
        expect(emailSender.sent[0]?.html).toBeUndefined();
    });

    it("should include html when provided", async () => {
        await sut.execute({ ...validInput, html: "<p>Hi</p>" });

        expect(emailSender.sent[0]?.html?.value).toBe("<p>Hi</p>");
    });

    it("should not call the provider when the subject is invalid", async () => {
        await expect(
            sut.execute({ ...validInput, subject: " "})
        ).rejects.toThrow(SubjectCannotBeEmptyError);

        expect(emailSender.sent).toHaveLength(0);
    })
})