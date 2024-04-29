import { FastifyReply, type FastifyRequest } from "fastify";
import { items } from "~/data/items";
import { minifyHtml } from "~/server/lib/htmlMinify";

const handler = (req: FastifyRequest, reply: FastifyReply) => {
  const createItemRow = (item: (typeof items)[number]) => {
    return `
      <li
        data-id="${item.id}"
        class="border-contrast-foreground/60 mx-auto flex max-w-sm flex-col gap-0.5 rounded-lg border py-2 px-1 text-center"
      >
        <strong>${item.name}</strong>
        <p class="text-balance">${item.content}</p>
      </li>
    `.trim();
  };

  const itemRows = items.map((x) => createItemRow(x)).join("");
  const minified = minifyHtml(itemRows);

  reply.send(minified);
};

export default handler;
