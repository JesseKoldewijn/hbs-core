interface Document {
  startViewTransition?: (callback: () => void) => void;
}

function spaNavigate(href: string, e: Event) {
  // Fallback for browsers that don't support this API:
  if (!document.startViewTransition) {
    return;
  }

  interface CustomEvent extends Event {
    "htmx-internal-data": any;
  }

  // With a transition:
  document.startViewTransition(async () => {
    // check if e has the key of "htmx-internal-data"
    const IsHxBoost = !!(e as CustomEvent)["htmx-internal-data"];

    if (IsHxBoost) {
      e.preventDefault();
    } else {
      const isInternalLink =
        href.startsWith(window.location.origin) || href.startsWith("/");

      if (isInternalLink) {
        // check if either target or current target has the href attribute

        console.warn(
          "Internal link detected, but missing hx-boost. Please add hx-boost to the anchor tag.",
          e,
        );

        alert("A internal problem has occurred. Please try again later.");
      } else {
        window.location.assign(href);
      }
    }
  });
}

// listen for any anchor tag click
document.addEventListener("click", function (e: any) {
  if (!e) return;

  const targetIsAnchor =
    e.target?.tagName === "A" ||
    e.currentTarget?.tagName === "A" ||
    e.target?.parentElement?.tagName === "A";

  const targetHref =
    e.target?.href || e.currentTarget?.href || e.target?.parentElement?.href;

  if (targetIsAnchor) {
    e.preventDefault();
    spaNavigate(targetHref, e);
  }
});
