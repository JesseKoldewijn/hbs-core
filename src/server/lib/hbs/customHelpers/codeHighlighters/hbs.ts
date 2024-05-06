import Handlebars from "handlebars";

import "highlight.js/styles/obsidian.min.css";

import formatHtml from "html-format";

// Using ES6 import syntax
import hljs from "highlight.js/lib/core";
import hbs from "highlight.js/lib/languages/handlebars";

// Then register the languages you need
hljs.registerLanguage("handlebars", hbs);

Handlebars.registerHelper(
  "highlight-hbs",
  function (options: Handlebars.HelperOptions) {
    let result = "";
    const children = options.fn({});

    // remove leading and trailing white spaces
    const codeLines = children.split("\n");
    const trimmedCode = codeLines.map((line) => line.trim()).join("\n");

    result += formatHtml(trimmedCode);

    // example of string replace call = "[str-replace="bc_money:0"]"
    const replaceCalls = result.match(/\[str-replace=".*"\]/g);
    if (replaceCalls) {
      replaceCalls.forEach((replaceCall) => {
        const rC = replaceCall.match(/"(.*)"/);
        if (rC) {
          const rCValue = rC[1];
          const isHelper = rCValue.includes(":");

          if (isHelper) {
            const val = rCValue.split(":").at(-1);
            const helper = rCValue.split(":").at(0);

            result = result.replace(replaceCall, `{{${helper} ${val}}}`);
          }

          result = result.replace(replaceCall, rCValue);
        }
      });
    }

    const highlighted = hljs.highlight(result, {
      language: "handlebars",
    }).value;

    return `<pre class="code-block"><code class="hljs language-handlebars">${highlighted}</code></pre>`;
  },
);
