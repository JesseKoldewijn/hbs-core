module.exports = {
  syntax: "postcss-scss",
  plugins: {
    // the order of the following three are very important!
    "@tailwindcss/postcss": {},
    "@csstools/postcss-sass": {},
    cssnano: { preset: "advanced" },
  },
};
