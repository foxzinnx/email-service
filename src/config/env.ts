import dotenv from 'dotenv';
import z from 'zod';
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(3333),
    HOST: z.string().default("0.0.0.0"),

    SMTP_HOST: z
        .string({ error: "SMTP_HOST is required" })
        .min(1, "SMTP_HOST cannot be empty"),
    SMTP_PORT: z.coerce
        .number({ error: 'SMTP_PORT is required' })
        .int()
        .positive(),
    SMTP_SECURE: z
        .enum(["true", "false"], {
            error: 'SMTP_SECURE must be "true" or "false"',
        })
        .default("false")
        .transform((value) => value === 'true'),
    SMTP_USER: z
        .string({ error: "SMTP_USER is required" })
        .min(1, "SMTP_USER cannot be empty"),
    SMTP_PASS: z
        .string({ error: "SMTP_PASS is required" })
        .min(1, "SMTP_PASS cannot be empty")
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
    console.error("Invalid environment variables: \n");

    const errors = z.flattenError(parsed.error).fieldErrors;

    Object.entries(errors).forEach(([field, message]) => {
        console.error(`${field}: ${message.join(', ')}`);
    });

    console.error("\nFix the errors above and restart the server.\n");
    process.exit(1);
}

export type Env = z.infer<typeof envSchema>;
export const env: Env = parsed.data;