import htmlMinify from "@minify-html/node";

export const minifyHtml = (html: string) => {
  try {
    const buffer = Buffer.from(html, "utf-8");
    return htmlMinify.minify(buffer, {
      remove_bangs: true,
      remove_processing_instructions: true,
      ensure_spec_compliant_unquoted_attribute_values: true,
      keep_html_and_head_opening_tags: true,
      preserve_brace_template_syntax: true,
    });
  } catch (error) {
    return "<h1>Failed to minify HTML</h1>";
  }
};
