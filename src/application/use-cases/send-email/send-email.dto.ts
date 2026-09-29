export interface SendEmailInput {
    from: string;
    to: string;
    subject: string;
    body: string;
    html?: string;
}