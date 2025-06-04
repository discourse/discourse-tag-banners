import Component from "@ember/component";
import { concat } from "@ember/helper";
import concatClass from "discourse/helpers/concat-class";
import htmlSafe from "discourse/helpers/html-safe";

export default class DiscourseTagBannersPresentation extends Component {
  tagName = ""; // removing an extra tag that is added by default

  <template>
    <div
      class={{concatClass
        "tag-title-header"
        (concat "tag-banner-" @formattedTagName)
        @additionalClass
      }}
    >
      <div class="tag-title-contents">
        <h1>
          <span>{{@formattedTagName}}</span>
          {{#if @formattedAdditionalTagNames}}
            &amp;
            {{@formattedAdditionalTagNames}}
          {{/if}}
        </h1>
        {{#unless @isIntersection}}
          {{! hide descriptions on tag intersections}}
          {{#if settings.show_tag_description}}
            <p>{{htmlSafe @tag.description}}</p>
          {{/if}}
        {{/unless}}
      </div>
    </div>
  </template>
}
