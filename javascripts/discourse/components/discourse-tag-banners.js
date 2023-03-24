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

  get isVisible() {
    if (
      this.currentRouteParams.tag_id &&
      this.currentRouteParams.tag_id !== "none"
    ) {
      this.keepDuringLoadingRoute = true;
      this.isLoading = false;
      return true;
    } else {
      if (this.router.currentRoute.name.includes("loading")) {
        return this.keepDuringLoadingRoute;
      } else {
        this.keepDuringLoadingRoute = false;
        this.tag = null;
        return false;
      }
    }
  }

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
    return this.isVisible && this.keepDuringLoadingRoute;
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
    if (!this.isVisible) {
      return;
    }

    const tag = this.currentRouteParams.tag_id;

    if (tag) {
      const result = await this.store.find("tag-info", tag);
      this.isIntersection = this.currentRouteParams.additional_tags;
      this.tag = result;
    }
  }
}
