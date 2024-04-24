/**
 * Format numbers
 *
 * @param integer n: length of decimal
 * @param mixed   s: thousands delimiter
 * @param mixed   c: decimal delimiter
 */
function numberFormat(value: number, n: number, s: number, c: string) {
  var re = "\\d(?=(\\d{3})+" + (n > 0 ? "\\D" : "$") + ")",
    num = value.toFixed(Math.max(0, ~~n));

  return (c ? num.replace(".", c) : num).replace(
    new RegExp(re, "g"),
    "$&" + (s || ","),
  );
}
import Handlebars from "handlebars";

Handlebars.registerHelper("bc_money", (...args) => {
  const money = {
    currency_token: Intl.NumberFormat().resolvedOptions().currency || "€",
    currency_location: "left",
    decimal_places: 2,
    thousands_token: ".",
    decimal_token: ",",
  };

  // remove options hash object
  args.pop();

  let value = args[0];

  if (isNaN(value)) {
    console.error("money helper accepts only Number's as first parameter");
    return;
  }

  const decimalPlaces = args[1] || money.decimal_places;

  if (isNaN(decimalPlaces)) {
    console.error("money helper accepts only Number's for decimal places");
    return;
  }
  const thousandsToken = args[2] || money.thousands_token;
  const decimalToken = args[3] || money.decimal_token;

  value = numberFormat(value, decimalPlaces, thousandsToken, decimalToken);

  const decimalIsDoubleZero = value.endsWith(`${decimalToken}00`);

  if (decimalIsDoubleZero) {
    value = value.replace(`${decimalToken}00`, ",-");
  }

  return money.currency_location.toLowerCase() === "left"
    ? money.currency_token + " " + value
    : value + " " + money.currency_token;
});
