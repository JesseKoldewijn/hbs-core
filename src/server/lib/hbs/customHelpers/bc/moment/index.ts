import Handlebars from "handlebars";
import moment, { Moment } from "moment";
import { dateParser } from "~/utils/moment";

moment.suppressDeprecationWarnings = true;

Handlebars.registerHelper("moment", (str, pattern, opts) => {
  // always use the Handlebars-generated options object
  return dateParser(str, pattern, opts);
});
