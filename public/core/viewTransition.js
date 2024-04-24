"use strict";
function spaNavigate(href, e) {
    // Fallback for browsers that don't support this API:
    if (!document.startViewTransition) {
        return;
    }
    // With a transition:
    document.startViewTransition(() => {
        // check if e has the key of "htmx-internal-data"
        const IsHxBoost = !!e["htmx-internal-data"];
        if (IsHxBoost) {
            e.preventDefault();
        }
        else {
            const isInternalLink = href.startsWith(window.location.origin) || href.startsWith("/");
            if (isInternalLink) {
                const elemRef = e.target;
                console.warn("Internal link clicked, but not handled by htmx. Please add `hx-boost` to the anchor tag", elemRef);
            }
            else {
                window.location.assign(href);
            }
        }
    });
}
// listen for any anchor tag click
document.addEventListener("click", function (e) {
    if (!e)
        return;
    const targetIsAnchor = e.target?.tagName === "A" ||
        e.currentTarget?.tagName === "A" ||
        e.target?.parentElement?.tagName === "A";
    const targetHref = e.target?.href || e.currentTarget?.href || e.target?.parentElement?.href;
    if (targetIsAnchor) {
        e.preventDefault();
        spaNavigate(targetHref, e);
    }
});
