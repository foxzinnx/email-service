import { env } from "../config/env.js";
import { SendEmailController } from "../infrastructure/http/controllers/send-email.controller.js";
import { buildServer } from "../infrastructure/http/server.js";
import { makeSendEmailUseCase } from "./factories/make-send-email-use-case.js";

async function bootstrap(){
    const sendEmailController = new SendEmailController(makeSendEmailUseCase());

    const app = await buildServer({
        sendEmailController,
        apiKey: env.API_KEY,
        logger: env.NODE_ENV !== "test"
    });

    await app.listen({ port: env.PORT, host: env.HOST });
}

bootstrap().catch((error) => {
    console.error(error);
    process.exit(1);
});