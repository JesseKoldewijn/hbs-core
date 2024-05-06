import { items } from "~/data/items";

const words = ["This", "is", "a", "sentence"];

const context = {
  pathname: "/about",
  page: {
    title: "About | Fastify Handlebars",
    desc: "This is the about page",
  },
  items,
  someEscapedString: words.join("\n"),
};
export default context;
