const activeLinks = async () => {
  document.addEventListener("DOMContentLoaded", () => {
    const setActiveLink = () => {
      const anchors = document.querySelectorAll(
        "a[data-visibly-active='true']",
      );

      if (anchors.length > 0) {
        anchors.forEach((anchor) => {
          const currentAnchor = anchor;
          const currentPath = window.location.pathname;
          const currentHref = currentAnchor.getAttribute("href");

          if (currentHref === currentPath) {
            const isButton = currentAnchor.classList.contains("button");
            if (isButton) {
              currentAnchor.classList.add("button--active");
            } else {
              currentAnchor.classList.add("active");
            }
          }
        });
      }
    };
    setActiveLink();

    const fhbsCtx = document.querySelector("script[data-id='fhbs-ctx']");

    if (fhbsCtx) {
      let lastRanPathname = window.location.pathname;
      // listen for change element in the DOM
      const observer = new MutationObserver(() => {
        const f = document.querySelector<HTMLScriptElement>(
          "script[data-id='fhbs-ctx']",
        );
        if (f) {
          const ctx = { ...f.dataset };

          if (lastRanPathname !== ctx.location) {
            lastRanPathname = window.location.pathname;
            return;
          }

          lastRanPathname = window.location.pathname;

          setActiveLink();
        }
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
