import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { DomainError } from "../../domain/errors/domain.error.js";
import { FailedToSendEmailError } from "../../application/errors/failed-to-send-email.error.js";

export function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
){
    if(hasZodFastifySchemaValidationErrors(error)){
        return reply.status(400).send({
            error: "ValidationError",
            message: "Invalid request payload",
            issues: error.validation.map((issue) => ({
                path: issue.instancePath,
                message: issue.message
            }))
        });
    }

    if(error instanceof DomainError){
        return reply.status(400).send({
            error: error.name,
            message: error.message
        });
    }

    if(error instanceof FailedToSendEmailError){
        request.log.error({ err: error.cause }, "Failed to send email");
        return reply.status(502).send({
            error: "EmailDeliveryFailed",
            message: "Could not deliver the email. Try again later.",
            ...(process.env.NODE_ENV === "development" && {
                debug: String(error.cause),
            }),
        });
    }

    if(error.statusCode && error.statusCode < 500){
        return reply.status(error.statusCode).send({
            error: error.name,
            message: error.message,
        });
    }

    request.log.error(error);
    return reply.status(500).send({
        error: "InternalServerError",
        message: "Something went wrong.",
    });
}