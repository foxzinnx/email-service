import type { Transporter } from "nodemailer";
import type { EmailSenderProvider } from "../../../application/ports/email-sender-provider.interface.js";
import type { Email } from "../../../domain/entities/email.entity.js";
import nodemailer from "nodemailer";
import { FailedToSendEmailError } from "../../../application/errors/failed-to-send-email.error.js";

export interface NodemailerConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    }
}

export class NodemailerEmailProvider implements EmailSenderProvider {
    private readonly transporter: Transporter
    
    constructor(config: NodemailerConfig){
        this.transporter = nodemailer.createTransport(config);
    }

    async send(email: Email): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: email.from.value,
                to: email.to.value,
                subject: email.subject.value,
                text: email.body.value,
                html: email.html?.value
            });
        } catch (error) {
            throw new FailedToSendEmailError();
        }
    }
}