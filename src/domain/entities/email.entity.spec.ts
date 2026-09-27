import { describe, expect, it } from "vitest";
import { EmailAddress } from "../value-objects/email-address.vo.js";
import { EmailSubject } from "../value-objects/email-subject.vo.js";
import { EmailBody } from "../value-objects/email-body.vo.js";
import { Email } from "./email.entity.js";
import { EmailHtml } from "../value-objects/email-html.vo.js";

function makeEmailProps(overrides: Partial<{
    from: EmailAddress,
    to: EmailAddress,
    subject: EmailSubject,
    body: EmailBody,
    html?: EmailHtml
}> = {}){
    return {
        from: EmailAddress.create("bryan@email.com"),
        to: EmailAddress.create("teste@gmail.com"),
        subject: EmailSubject.create("Titulo do email"),
        body: EmailBody.create("Este é um texto muito grande"),
        ...overrides
    }
}

describe("Email Entity", () => {
    describe("Create", () => {
        it("should create a email with valid data", () => {
            const email = Email.create(makeEmailProps());

            expect(email.id.value).toBeDefined();
            expect(email.from.value).toBe("bryan@email.com");
            expect(email.to.value).toBe("teste@gmail.com");
            expect(email.subject.value).toBe("Titulo do email");
            expect(email.body.value).toBe("Este é um texto muito grande");
        });

        it("should create a valid email with HTML content", () => {
            const html = EmailHtml.create("<h1>Olá</h1>");
            const email = Email.create(makeEmailProps({ html }));

            expect(email.html?.value).toBe("<h1>Olá</h1>");
        });

        it("should automatically set createdAt", () => {
            const before = new Date();
            const email = Email.create(makeEmailProps());
            const after = new Date();

            expect(email.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(email.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
        });
    });

    describe("getters", () => {
        it("should return all properties correctly", () => {
            const props = makeEmailProps({
                html: EmailHtml.create("<p>Conteúdo do HTML</p>")
            });

            const email = Email.create(props);

            expect(email.id.value).toBeDefined();
            expect(email.from.value).toBe("bryan@email.com");
            expect(email.to.value).toBe("teste@gmail.com");
            expect(email.subject.value).toBe("Titulo do email");
            expect(email.body.value).toBe("Este é um texto muito grande");
            expect(email.html?.value).toBe("<p>Conteúdo do HTML</p>");
        })
    })
})