export interface SendEmailInput {
    to: string;
    subject: string;
    body: string;
    html?: string | undefined;
}