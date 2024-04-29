import Handlebars from "handlebars";

// Using ES6 import syntax
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";

// Then register the languages you need
hljs.registerLanguage("ts", typescript);

Handlebars.registerHelper(
  "highlight-ts",
  function (options: Handlebars.HelperOptions) {
    let result = "";
    const children = options.fn({});

    const highlighted = hljs.highlight("ts", children).value;
    result += highlighted;

    return `<pre><code class="hljs language-hbs">${result}</code></pre>`;
  },
);
