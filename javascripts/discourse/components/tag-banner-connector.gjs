import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { getOwner } from "@ember/owner";
import { service } from "@ember/service";
import DiscourseTagBanners from "./discourse-tag-banners";

export default class TagBannerConnector extends Component {
  @service router;

  @tracked categoryBannerPresence = null;

  constructor() {
    super(...arguments);

    // this prevents a failure if the category banner component is not installed
    this.categoryBannerPresence = getOwner(this).lookup(
      "service:categoryBannerPresence"
    );
  }

  get hiddenByCategoryBanner() {
    return (
      !settings.show_with_category_banners &&
      this.categoryBannerPresence &&
      !!this.router?.currentRoute?.params?.category_slug_path_with_id
    );
  }

  <template>
    {{#unless this.hiddenByCategoryBanner}}
      <DiscourseTagBanners />
    {{/unless}}
  </template>
}
