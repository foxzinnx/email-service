import { env } from "../../config/env.js";
import { NodemailerEmailProvider } from "../../infrastructure/providers/mail/nodemailer-email.provider.js";

export function makeNodemailerEmailProvider(): NodemailerEmailProvider {
    return new NodemailerEmailProvider({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS
        }
    });
}