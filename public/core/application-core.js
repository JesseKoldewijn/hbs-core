const applicationCore = async () => {
    // you can do something here ;)
    const activeLinks = await import("./page-logic/active-links.js");
    activeLinks.default();
};
export default applicationCore;
