import Handlebars from "handlebars";

Handlebars.registerHelper(
  "truncate",
  function (string: string, length: number, options: Handlebars.HelperOptions) {
    if (typeof string !== "string" || string.length === 0) {
      return string;
    }

    const truncatedString = String(string).substring(0, length);

    return new Handlebars.SafeString(truncatedString);
  },
);
