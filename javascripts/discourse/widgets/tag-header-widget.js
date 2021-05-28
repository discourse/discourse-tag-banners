import { createWidget } from "discourse/widgets/widget";
import { getOwner } from "discourse-common/lib/get-owner";
import { h } from "virtual-dom";

export default createWidget("tag-header-widget", {
  tagName: "span",
  html() {
    const router = getOwner(this).lookup("router:main");
    const route = router.currentRoute;

    if (route && route.params && route.params.hasOwnProperty("tag_id")) {
      const hideMobile =
        !settings.show_on_mobile && this.site.mobileView ? "true" : hideMobile;

      const router = getOwner(this).lookup("router:main");
      const route = router.currentRoute;

      let tag = route.params.tag_id;
      let additionalTags = route.params.additional_tags;

      if (!hideMobile && tag != "none") {
        document.querySelector("body").classList.add("tag-banner");

        if (additionalTags) {
          var tagList = additionalTags.split("/");
          var additionalTagNames = h("span", " & " + tagList.join(" & "));
          var additionalNaming = tagList.map(function (e) {
            return "tag-banner-" + e;
          });
          var additionalClasses = additionalNaming.join(".");
        } else {
          var additionalClasses = "single-tag";
        }

        return h(
          "div.tag-title-header" +
            " .tag-banner-" +
            tag +
            " ." +
            additionalClasses,
          h("div.tag-title-contents", [
            h("h1", [h("span", tag), additionalTagNames]),
          ])
        );
      } else {
        document.querySelector("body").classList.remove("tag-banner");
      }
    }
  },
});
