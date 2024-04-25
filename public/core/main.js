import "./viewTransition.js";
const main = async () => {
    if ($ !== undefined) {
        const appCore = await import("./application-core.js");
        appCore.default();
    }
};
main();
