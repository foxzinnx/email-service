import fastify from "fastify";
import type { SendEmailController } from "./controllers/send-email.controller.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { errorHandler } from "./error-handler.js";
import rateLimit from "@fastify/rate-limit";
import { emailRoutes } from "./routes/email.routes.js";

interface BuildServerDeps {
    sendEmailController: SendEmailController;
    apiKey: string;
    logger: boolean;
}

export async function buildServer(deps: BuildServerDeps){
    const app = fastify({ logger: deps.logger });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);

    await app.register(rateLimit, { global: false });

    await app.register(
        emailRoutes({
            sendEmailController: deps.sendEmailController,
            apiKey: deps.apiKey
        })
    );

    app.get("/health", async () => ({ status: "ok" }));

    return app;
}