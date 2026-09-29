import type { Email } from "../../domain/entities/email.entity.js";

export interface EmailSenderProvider {
    send(email: Email): Promise<void>;
}