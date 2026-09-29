import z from "zod";

export const sendEmailBodySchema = z
    .object({
        to: z.string(),
        subject: z.string(),
        body: z.string(),
        html: z.string().optional(),
    })
    .strict();

export const sendEmailResponseSchema = z.object({
    message: z.string()
});