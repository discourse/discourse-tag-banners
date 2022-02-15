import { createWidget } from "discourse/widgets/widget";
import { getOwner } from "discourse-common/lib/get-owner";
import { h } from "virtual-dom";

export default createWidget("tag-header-widget", {
  tagName: "span",

  buildKey: () => `tag-header-widget`,

  defaultState() {
    return { loaded: false, tag: null };
  },

  getTagInfo(tag) {
    this.store.find("tag-info", tag).then((result) => {
      this.state.tag = result;
      this.state.loaded = true;
      this.scheduleRerender();
    });
  },

  html() {
    const router = getOwner(this).lookup("router:main");
    const route = router.currentRoute;
    const hideMobile =
      !settings.show_on_mobile && this.site.mobileView ? "true" : hideMobile;

    if (route && route.params && route.params.hasOwnProperty("tag_id")) {
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
        let tagDescription;

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

        if (!this.state.loaded) {
          this.getTagInfo(tag);
        } else {
          if (this.state.tag.name != tag) {
            // update the tag description when the route's tag changes
            this.getTagInfo(tag);
          }

          if (additionalTags || !settings.show_tag_description) {
            tagDescription = "";
          } else {
            tagDescription = this.state.tag.description;
          }

          return h(
            `div.tag-title-header .tag-banner-${tag} .${additionalClass}`,
            h("div.tag-title-contents", [
              h("h1", [h("span", tag), additionalTagNames]),
              h("p", tagDescription),
            ])
          );
        }
      } else {
        document.querySelector("body").classList.remove("tag-banner");
      }
    }
  },
});
