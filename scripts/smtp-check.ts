import nodemailer from "nodemailer";
import { env } from "../src/config/env";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

try {
    console.log("USER:", JSON.stringify(env.SMTP_USER));
    console.log("PASS length:", env.SMTP_PASS.length); // esperado: 18
    console.log("PASS first/last:", env.SMTP_PASS[0], env.SMTP_PASS.at(-1));
    await transporter.verify();
    console.log("SMTP OK: conexão e autenticação funcionaram.");
} catch (error) {
    console.error("SMTP FAIL:", error);
}