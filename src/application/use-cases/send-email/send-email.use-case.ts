import { Email } from "../../../domain/entities/email.entity.js";
import { EmailAddress } from "../../../domain/value-objects/email-address.vo.js";
import { EmailBody } from "../../../domain/value-objects/email-body.vo.js";
import { EmailHtml } from "../../../domain/value-objects/email-html.vo.js";
import { EmailSubject } from "../../../domain/value-objects/email-subject.vo.js";
import type { EmailSenderProvider } from "../../ports/email-sender-provider.interface.js";
import type { SendEmailInput } from "./send-email.dto.js";

export class SendEmailUseCase {
    constructor(
        private readonly emailSender: EmailSenderProvider,
        private readonly defaultSender: EmailAddress
    ){}

    async execute(input: SendEmailInput): Promise<void>{
        const email = Email.create({
            from: this.defaultSender,
            to: EmailAddress.create(input.to),
            subject: EmailSubject.create(input.subject),
            body: EmailBody.create(input.body),
            html: input.html !== undefined ? EmailHtml.create(input.html) : undefined,
        });

        await this.emailSender.send(email);
    }
}