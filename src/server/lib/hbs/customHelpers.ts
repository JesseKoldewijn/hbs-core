import Handlebars from "handlebars";

Handlebars.registerHelper(
  "times",
  function (count: number, options: Handlebars.HelperOptions) {
    let result = "";

    for (let i = 0; i < count; i++) {
      result += options.fn(i);
    }

    return result;
  },
);
