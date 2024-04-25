import { items } from "~/data/items";

const context = {
  pathname: "/",
  page: {
    title: "Fastify Handlebars",
    desc: "This is the home page",
  },
  items,
};
export default context;
