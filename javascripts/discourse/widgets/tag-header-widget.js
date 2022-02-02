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

      let tag = route.params.tag_id;
      let additionalTags = route.params.additional_tags;

      if (settings.remove_tag_hyphen) {
        tag = tag.replace(/-/g, " ");
        additionalTags = additionalTags
          ? additionalTags.replace(/-/g, " ")
          : null;
      }

      if (!hideMobile && tag != "none") {
        document.querySelector("body").classList.add("tag-banner");

        let additionalTagNames;
        let additionalClass;

        if (additionalTags) {
          let tagList = additionalTags.split("/");
          let additionalClassList = tagList.map(function (e) {
            return `tag-banner-${e}`;
          });
          additionalTagNames = h("span", ` & ${tagList.join(" & ")}`);
          additionalClass = additionalClassList.join(".");
        } else {
          additionalClass = "single-tag";
        }

        return h(
          `div.tag-title-header .tag-banner-${tag} .${additionalClass}`,

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
