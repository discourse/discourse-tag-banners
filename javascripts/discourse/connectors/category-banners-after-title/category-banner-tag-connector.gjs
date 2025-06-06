import Component from "@ember/component";
import { tagName } from "@ember-decorators/component";
import DiscourseTagBanners from "../../components/discourse-tag-banners";

@tagName("")
export default class CategoryBannerTagConnector extends Component {
  <template>
    {{#unless settings.show_with_category_banners}}
      <DiscourseTagBanners />
    {{/unless}}
  </template>
}
