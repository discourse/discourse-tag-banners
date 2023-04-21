import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class DiscourseTagBanners extends Component {
  @service store;
  @service router;
  @service site;
  @tracked tag = null;
  @tracked keepDuringLoadingRoute = false;
  @tracked isIntersection = false;

  #formatTagName(tagName = "") {
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

  get currentRouteParams() {
    return this.router?.currentRoute?.params;
  }

  get shouldRender() {
    return (
      (this.currentRouteParams.tag_id !== "none" &&
        this.currentRouteParams?.tag_id) ||
      (this.keepDuringLoadingRoute &&
        this.router.currentRoute.name.includes("loading"))
    );
  }

  get formattedTagName() {
    return this.#formatTagName(this.tag?.name);
  }

  get formattedAdditionalTagNames() {
    const additionalTags = this.currentRouteParams.additional_tags;
    return additionalTags ? this.#formatTagName(additionalTags) : "";
  }

  get additionalClass() {
    if (this.formattedAdditionalTagNames === "") {
      return "single-tag";
    }

    let tagList = this.formattedAdditionalTagNames.split(" & ");
    return tagList.map((e) => `tag-banner-${e}`).join(" ");
  }

  @action
  async getTagInfo() {
    const tag = this.currentRouteParams?.tag_id;
    if (tag) {
      const result = await this.store.find("tag-info", tag);
      this.tag = result;
      this.isIntersection = this.currentRouteParams.additional_tags;
      this.keepDuringLoadingRoute = true;
    } else {
      if (!this.router.currentRoute.name.includes("loading")) {
        this.keepDuringLoadingRoute = false;
      }
    }
  }

  @action
  resetTag() {
    this.keepDuringLoadingRoute = false;
    this.tag = null;
  }
}
