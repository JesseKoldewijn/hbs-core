import { items } from "~/data/items";

const context = {
  pathname: "/about",
  page: {
    title: "About | Fastify Handlebars",
    desc: "This is the about page",
  },
  items,
};
export default context;
