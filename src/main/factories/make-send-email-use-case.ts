import { SendEmailUseCase } from "../../application/use-cases/send-email/send-email.use-case.js";
import { env } from "../../config/env.js";
import { EmailAddress } from "../../domain/value-objects/email-address.vo.js";
import { makeNodemailerEmailProvider } from "./make-nodemailer-email-provider.js";

export function makeSendEmailUseCase(): SendEmailUseCase {
    return new SendEmailUseCase(
        makeNodemailerEmailProvider(),
        EmailAddress.create(env.MAIL_FROM)
    );
}