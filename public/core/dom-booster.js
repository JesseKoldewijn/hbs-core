"use strict";
/**
 * @param {HTMLElement} elt
 * @param {string} name
 * @returns {(string | null)}
 */
function getRawAttribute(elt, name) {
    return elt.getAttribute && elt.getAttribute(name);
}
function boostElement(elt, nodeData, triggerSpecs) {
    if ((elt.tagName === "A" &&
        isLocalLink(elt) &&
        (elt.target === "" || elt.target === "_self")) ||
        elt.tagName === "FORM") {
        nodeData.boosted = true;
        var verb, path;
        if (elt.tagName === "A") {
            verb = "get";
            path = getRawAttribute(elt, "href");
        }
        else {
            var rawAttribute = getRawAttribute(elt, "method");
            verb = rawAttribute ? rawAttribute.toLowerCase() : "get";
            if (verb === "get") {
            }
            path = getRawAttribute(elt, "action");
        }
        triggerSpecs.forEach(function (triggerSpec) {
            addEventListener(elt, function (elt, evt) {
                if (closest(elt, htmx.config.disableSelector)) {
                    cleanUpElement(elt);
                    return;
                }
                issueAjaxRequest(verb, path, elt, evt);
            }, nodeData, triggerSpec, true);
        });
    }
}
