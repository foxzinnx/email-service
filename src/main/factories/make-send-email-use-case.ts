import { SendEmailUseCase } from "../../application/use-cases/send-email/send-email.use-case.js";
import { makeNodemailerEmailProvider } from "./make-nodemailer-email-provider.js";

export function makeSendEmailUseCase(): SendEmailUseCase {
    return new SendEmailUseCase(makeNodemailerEmailProvider());
}