export const htmxLoader = async () => {
  // @ts-expect-error
  await import("/libs/htmx.min.js");
};
