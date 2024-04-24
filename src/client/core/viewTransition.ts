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
        // get content of next page and replace the current page
        const nextPageRes = await fetch(href);
        const nextPageHtml = await nextPageRes.text();
        const nextPageBody = new DOMParser().parseFromString(
          nextPageHtml,
          "text/html",
        );
        const nextPageTitle = nextPageBody.querySelector("title")?.innerText;
        const nextPageDescription = nextPageBody
          .querySelector('meta[name="description"]')
          ?.getAttribute("content");
        const nextPageContent = nextPageBody.querySelector("body");

        document.title = nextPageTitle || "";
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute("content", nextPageDescription || "");
        document.body.innerHTML = nextPageContent?.innerHTML || "";

        // reTrigger the script tags
        const scripts = document.querySelectorAll("script");
        scripts.forEach((script) => {
          const newScript = document.createElement("script");
          newScript.text = script.text;
          script.replaceWith(newScript);
        });

        // @ts-expect-error
        htmx.process(document.body);
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
