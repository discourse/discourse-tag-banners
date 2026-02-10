import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { getOwner } from "@ember/owner";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import didUpdate from "@ember/render-modifiers/modifiers/did-update";
import willDestroy from "@ember/render-modifiers/modifiers/will-destroy";
import { service } from "@ember/service";
import { not, or } from "truth-helpers";
import DiscourseTagBannersPresentation from "./discourse-tag-banners-presentation";
import DiscourseTagBannersTextOnly from "./discourse-tag-banners-text-only";

export default class DiscourseTagBanners extends Component {
  @service store;
  @service router;
  @service site;

  @tracked categoryBannerPresence = null;
  @tracked tag = null;
  @tracked keepDuringLoadingRoute = false;
  @tracked isIntersection = false;
  @tracked showBanner = true;

  constructor() {
    super(...arguments);

    // this prevents a failure if the category banner component is not installed
    this.categoryBannerPresence = getOwner(this).lookup(
      "service:categoryBannerPresence"
    );
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

  get isTopicPage() {
    return this.router.currentRoute.name.includes("topic");
  }

  get shouldRender() {
    return (
      (this.currentRouteParams.tag_name !== "none" &&
        this.currentRouteParams?.tag_name) ||
      (this.keepDuringLoadingRoute &&
        this.router.currentRoute.name.includes("loading") ||
      (this.isTopicPage))
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

  get hideMobile() {
    return this.site.mobileView && !settings.show_on_mobile;
  }

  @action
  async getTagInfo() {
    const tag = !this.isTopic ? this.currentRouteParams?.tag_name : this.args.model.tags[0] ? this.args.model.tags[0].name : "";
    // eslint-disable-next-line no-console
    console.log("Tag: ' + tag + "'");
    if (tag === "") {
      // eslint-disable-next-line no-console
      console.log("Hiding");
      this.showBanner = false;
    }
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

  <template>
    {{#unless this.hideMobile}}
      {{#if this.shouldRender}}
        {{#if this.showBanner}}
          <div
            class="tag-banner-container"
            {{didInsert this.getTagInfo}}
            {{didUpdate this.getTagInfo this.shouldRender}}
            {{willDestroy this.resetTag}}
          >
            {{#if
              (or
                (not this.categoryBannerPresence.isPresent)
                settings.show_with_category_banners
              )
            }}
              <DiscourseTagBannersPresentation
                @formattedTagName={{this.formattedTagName}}
                @formattedAdditionalTagNames={{this.formattedAdditionalTagNames}}
                @isIntersection={{this.isIntersection}}
                @tag={{this.tag}}
                @additionalClass={{this.additionalClass}}
              />
            {{else}}
              <DiscourseTagBannersTextOnly
                @formattedTagName={{this.formattedTagName}}
                @formattedAdditionalTagNames={{this.formattedAdditionalTagNames}}
                @tag={{this.tag}}
              />
            {{/if}}
          </div>
        {{/if}}
      {{/if}}
    {{/unless}}
  </template>
}
