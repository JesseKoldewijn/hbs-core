import moment, { Moment } from "moment";
import { parseDate } from "chrono-node";

export const dateParser = (str: any, pattern: string, opts: any) => {
  // always use the Handlebars-generated options object
  let options = opts[opts.length - 1];

  // Ideally we'd check how many args were passed and set `str` and `pattern` to
  // null if they weren't explicitly provided. However, doing so could break
  // backwards compatibility since we previously depended on helper-date@0.2.3.

  // if no args are passed, return a formatted date
  if (str == null && pattern == null) {
    moment.locale("en");
    return moment().format("MMMM DD, YYYY");
  }

  // set the language to use
  moment.locale(opts.lang || opts.language);

  if (opts.datejs === false) {
    return moment(new Date(str)).format(pattern);
  }

  // if both args are strings, this could apply to either lib.
  // so instead of doing magic we'll just ask the user to tell
  // us if the args should be passed to date.js or moment.
  if (typeof str === "string" && typeof pattern === "string") {
    return moment(parseDate(str)).format(pattern);
  }

  // If handlebars, expose moment methods as hash properties
  if (options && options.hash) {
    if (options.context) {
      options.hash = Object.assign({}, options.hash, options.context);
    }

    var res = moment(str);

    for (var key in options.hash) {
      // prevent access to prototype methods
      if (
        Object.keys(moment.prototype).indexOf(key) !== -1 &&
        typeof res[key as keyof moment.Moment] === "function"
      ) {
        const f = res[key as keyof Moment] as (args: any) => string;
        return f(options.hash[key]);
      } else {
        console.error('moment.js does not support "' + key + '"');
      }
    }
  }

  // check if str is object
  if (
    typeof str === "object" &&
    str !== null &&
    str._isAMomentObject === true
  ) {
    return moment(str).format(pattern);
  }

  // if only a string is passed, assume it's a date pattern ('YYYY')
  if (typeof str === "string" && !pattern) {
    return moment().format(str);
  }

  return moment(str).format(pattern);
};
