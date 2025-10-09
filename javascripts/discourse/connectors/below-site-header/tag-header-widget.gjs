import { tracked } from "@glimmer/tracking";
import Component from "@ember/component";
import { getOwner } from "@ember/owner";
import { not, or } from "truth-helpers";
import DiscourseTagBanners from "../../components/discourse-tag-banners";

export default class extends Component {
  @tracked categoryBannerPresence = null;

  constructor() {
    super(...arguments);

    // this prevents a failure if the category banner component is not installed
    this.categoryBannerPresence = getOwner(this).lookup(
      "service:categoryBannerPresence"
    );
  }

  <template>
    {{#if settings.show_below_site_header}}
      {{#if
        (or
          (not this.categoryBannerPresence.isPresent)
          settings.show_with_category_banners
        )
      }}
        <DiscourseTagBanners />
      {{/if}}
    {{/if}}
  </template>
}
