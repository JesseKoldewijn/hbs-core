interface Document {
  startViewTransition?: (callback: () => void) => void;
}

function spaNavigate(href: string) {
  // Fallback for browsers that don't support this API:
  if (!document.startViewTransition) {
    return;
  }

  // With a transition:
  document.startViewTransition(() => {
    // other stuff can be done here as well
  });
}

// listen for any anchor tag click
document.addEventListener("click", function (e: any) {
  if (!e) return;

  const targetIsAnchor =
    e.target?.tagName === "A" ||
    e.currentTarget?.tagName === "A" ||
    e.target?.parentElement.tagName === "A";

  const targetHref =
    e.target?.href || e.currentTarget?.href || e.target?.parentElement.href;

  if (targetIsAnchor) {
    e.preventDefault();
    spaNavigate(targetHref);
  }
});
