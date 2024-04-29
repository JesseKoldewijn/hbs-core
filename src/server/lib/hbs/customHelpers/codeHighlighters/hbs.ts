import Handlebars from "handlebars";

// Using ES6 import syntax
import hljs from "highlight.js/lib/core";
import hbs from "highlight.js/lib/languages/handlebars";

// Then register the languages you need
hljs.registerLanguage("hbs", hbs);

Handlebars.registerHelper(
  "highlight-hbs",
  function (options: Handlebars.HelperOptions) {
    let result = "";
    const children = options.fn({});
    result += children;

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

    const highlighted = hljs.highlight("hbs", result).value;

    return `<pre><code class="hljs language-hbs">${highlighted}</code></pre>`;
  },
);
