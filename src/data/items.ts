const itemLength = 100;

const getItem = (id: number) => {
  return {
    id,
    name: `Item name ${id}`,
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, minus.",
  };
};

export const items = Array.from({ length: itemLength }, (_, i) =>
  getItem(i + 1),
);
