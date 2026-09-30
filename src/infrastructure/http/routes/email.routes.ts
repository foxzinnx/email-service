import type { FastifyInstance } from "fastify";
import type { SendEmailController } from "../controllers/send-email.controller.js";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { makeApiKeyHook } from "../middlewares/api-key.hook.js";
import { sendEmailBodySchema, sendEmailResponseSchema } from "../schemas/send-email.schema.js";

interface EmailRoutesDeps {
    sendEmailController: SendEmailController;
    apiKey: string;
}

export function emailRoutes({ sendEmailController, apiKey }: EmailRoutesDeps){
    return async function (app: FastifyInstance){
        app.withTypeProvider<ZodTypeProvider>().post(
            "/emails",
            {
                preHandler: makeApiKeyHook(apiKey),
                config: {
                    rateLimit: { max: 10, timeWindow: "1 minute" },
                },
                schema: {
                    body: sendEmailBodySchema,
                    response: { 200: sendEmailResponseSchema }
                }
            },
            (request, reply) => sendEmailController.handle(request, reply)
        )
    }
}