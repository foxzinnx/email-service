import type { FastifyReply, FastifyRequest } from "fastify";
import type { SendEmailUseCase } from "../../../application/use-cases/send-email/send-email.use-case.js";
import type z from "zod";
import type { sendEmailBodySchema } from "../schemas/send-email.schema.js";

type SendEmailRequest = FastifyRequest<{
    Body: z.infer<typeof sendEmailBodySchema>;
}>

export class SendEmailController {
    constructor(private readonly sendEmailUseCase: SendEmailUseCase){};

    async handle(request: SendEmailRequest, reply: FastifyReply){
        await this.sendEmailUseCase.execute(request.body);

        return reply.status(200).send({ message: "Email sent successfully." });
    }
}