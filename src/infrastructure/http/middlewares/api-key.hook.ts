import type { FastifyReply, FastifyRequest } from "fastify";
import { timingSafeEqual } from "node:crypto";

export function makeApiKeyHook(expectedKey: string){
    const expected = Buffer.from(expectedKey);

    return async function apiKeyHook(request: FastifyRequest, reply: FastifyReply){
        const provided = request.headers["x-api-key"];

        if(typeof provided !== "string"){
            return reply.status(401).send({ error: "Unauthorized" });
        }

        const providedBuffer = Buffer.from(provided);

        const isValid = providedBuffer.length === expected.length && timingSafeEqual(providedBuffer, expected);

        if(!isValid){
            return reply.status(401).send({ error: "Unauthorized" });
        }
    }
}