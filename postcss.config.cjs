module.exports = {
  syntax: "postcss-scss",
  plugins: {
    "@tailwindcss/postcss": {},
    "@csstools/postcss-sass": {},
    cssnano: { preset: "advanced" },
  },
};
