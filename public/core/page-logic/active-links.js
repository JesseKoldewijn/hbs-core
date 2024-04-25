const activeLinks = async () => {
    $(() => {
        const setActiveLink = () => {
            const anchors = $("a[data-visibly-active='true']");
            if (anchors.length > 0) {
                anchors.each((index, anchor) => {
                    const currentAnchor = $(anchor);
                    const currentPath = window.location.pathname;
                    const currentHref = currentAnchor.attr("href");
                    if (currentHref === currentPath) {
                        const isButton = currentAnchor.hasClass("button");
                        if (isButton) {
                            currentAnchor.addClass("button--active");
                        }
                        else {
                            currentAnchor.addClass("active");
                        }
                    }
                });
            }
        };
        setActiveLink();
        const fhbsCtx = $("script[data-id='fhbs-ctx']");
        if (fhbsCtx) {
            let lastRanPathname = window.location.pathname;
            // listen for change element in the DOM
            const observer = new MutationObserver(() => {
                const f = $("script[data-id='fhbs-ctx']");
                const ctx = { ...f[0].dataset };
                if (lastRanPathname !== ctx.location) {
                    lastRanPathname = window.location.pathname;
                    return;
                }
                lastRanPathname = window.location.pathname;
                console.log("ctx", ctx.location, window.location.pathname);
                setActiveLink();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }
    });
};
export default activeLinks;
