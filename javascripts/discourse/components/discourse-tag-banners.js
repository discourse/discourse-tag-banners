import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class DiscourseTagBanners extends Component {
  @service store;
  @service router;
  @service site;
  @tracked loaded = false;
  @tracked tag = null;
  @tracked formattedTagName = "";
  @tracked formattedAdditionalTagNames = "";
  @tracked additionalClass = "";
  @tracked tagDescription = "";
  @tracked isVisible = false;

  constructor() {
    super(...arguments);
    this.router.on("routeDidChange", this, this.routeChanged);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.router.off("routeDidChange", this, this.routeChanged);
  }

  @action
  routeChanged() {
    if (this.site.mobileView && !settings.show_on_mobile) {
      return;
    }

    const route = this.router.currentRoute;
    if (route && route.params && route.params.hasOwnProperty("tag_id")) {
      const tag = route.params.tag_id;
      this.isVisible = true;
      this.getTagInfo(tag);
    } else {
      this.isVisible = false;
    }
  }

  formatTagName(tagName = "") {
    // for intersections: tag1/tag2 => tag1 & tag2
    tagName = tagName.replace(/\//g, " & ");

    if (settings.remove_tag_hyphen) {
      tagName = tagName.replace(/-/g, " ");
    }
    if (settings.remove_tag_underscore) {
      tagName = tagName.replace(/_/g, " ");
    }
    return tagName;
  }

  getAdditionalClass() {
    let tagList = this.formattedAdditionalTagNames.split(" & ");
    return tagList.map((e) => `tag-banner-${e}`).join(" ");
  }

  @action
  async getTagInfo(tag) {
    if (tag === "none") {
      this.loaded = false;
      return;
    }

    const route = this.router.currentRoute;
    const result = await this.store.find("tag-info", tag);
    let additionalTags = route.params.additional_tags;

    this.formattedTagName = this.formatTagName(tag);
    this.formattedAdditionalTagNames = this.formatTagName(additionalTags);

    if (additionalTags) {
      this.additionalClass = this.getAdditionalClass();
    } else {
      this.additionalClass = "single-tag";
    }

    this.tag = result;
    this.loaded = true;
    this.tagDescription = this.tag.description || "";
  }
}
