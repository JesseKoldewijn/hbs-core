import Handlebars from "handlebars";

type htmlElementTags = keyof HTMLElementTagNameMap;

Handlebars.registerHelper(
  "nl2br",
  function (
    string: string,
    tagWrap: htmlElementTags,
    options: Handlebars.HelperOptions,
  ) {
    if (typeof string !== "string" || string.length === 0) {
      return string;
    }

    const regex = new RegExp(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g);

    const openTag =
      tagWrap && typeof tagWrap === "string" ? `<${tagWrap}>` : "";
    const closeTag =
      tagWrap && typeof tagWrap === "string" ? `</${tagWrap}>` : "";

    const nl2br = (Handlebars.escapeExpression(string) + "").replace(
      regex,
      "$1" + "<br>" + "$2",
    );

    const nl2BrWrapped = nl2br
      .split("<br>")
      .map((line) => `${openTag}${line.trim()}${closeTag}<br>`)
      .join("");

    return new Handlebars.SafeString(nl2BrWrapped);
  },
);
