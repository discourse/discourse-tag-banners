/* eslint-disable ember/no-classic-components */
import Component from "@ember/component";
import icon from "discourse/helpers/d-icon";
import discourseTag from "discourse/helpers/discourse-tag";
import { eq } from "discourse/truth-helpers";

export default class DiscourseTagBannersTextOnly extends Component {
  tagName = ""; // removing an extra tag that is added by default

  <template>
    <div class="tag-banner__text-only">
      {{#if (eq this.site.siteSettings.tag_style "simple")}}
        {{#if (eq settings.hide_tag_icon false)}}
          {{icon "tag"}}
        {{/if}}
      {{/if}}
      {{#if @tag}}
        {{discourseTag @tag.name displayName=@formattedTagName}}
      {{/if}}
      {{#if @formattedAdditionalTagNames}}
        &amp;
        {{@formattedAdditionalTagNames}}
      {{/if}}
    </div>
  </template>
}
