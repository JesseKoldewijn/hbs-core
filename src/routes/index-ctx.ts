const itemLength = 10;

const getItem = (id: number) => {
  return {
    id,
    name: `Item name ${id}`,
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, minus.",
  };
};
const items = Array.from({ length: itemLength }, (_, i) => getItem(i + 1));

const context = {
  page: {
    title: "Fastify Handlebars",
    desc: "This is the home page",
  },
  items,
};
export default context;
