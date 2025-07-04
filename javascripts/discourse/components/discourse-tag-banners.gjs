import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { getOwner } from "@ember/application";
import { action } from "@ember/object";
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

  get hideMobile() {
    return this.site.mobileView && !settings.show_on_mobile;
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

  <template>
    {{#unless this.hideMobile}}
      {{#if this.shouldRender}}
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
    {{/unless}}
  </template>
}
