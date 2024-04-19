import { FastifyReply, type FastifyRequest } from "fastify";

const handler = (req: FastifyRequest, reply: FastifyReply) => {
  reply.headers({
    "Content-Type": "application/json",
  });

  reply.send({ message: "Hello and thanks for using Fastify Handlebars!" });
};

export default handler;
