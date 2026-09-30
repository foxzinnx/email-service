import { env } from "../config/env.js";
import { SendEmailController } from "../infrastructure/http/controllers/send-email.controller.js";
import { buildServer } from "../infrastructure/http/server.js";
import { makeNodemailerEmailProvider } from "./factories/make-nodemailer-email-provider.js";
import { makeSendEmailUseCase } from "./factories/make-send-email-use-case.js";

const SHUTDOWN_TIMEOUT_MS = 10_000;

async function bootstrap(){
    const emailProvider = makeNodemailerEmailProvider();
    const sendEmailController = new SendEmailController(
        makeSendEmailUseCase(emailProvider)
    );

    const app = await buildServer({
        sendEmailController,
        apiKey: env.API_KEY,
        logger: env.NODE_ENV !== "test"
    });

    let shuttingDown = false;

    async function shutdown(signal: NodeJS.Signals) {
        if (shuttingDown) return;
        shuttingDown = true;

        app.log.info({ signal }, "Shutdown signal received, closing server...");

        const forceExit = setTimeout(() => {
            app.log.error("Graceful shutdown timed out, forcing exit.");
            process.exit(1);
        }, SHUTDOWN_TIMEOUT_MS);
        forceExit.unref();

        try {
            await app.close();
            emailProvider.close();

            app.log.info("Shutdown complete.");
            process.exit(0);
        } catch (error) {
            app.log.error(error, "Error during shutdown");
            process.exit(1);
        }
    }

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);


    await app.listen({ port: env.PORT, host: env.HOST });
}

bootstrap().catch((error) => {
    console.error(error);
    process.exit(1);
});