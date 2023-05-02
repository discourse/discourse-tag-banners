import Component from "@ember/component";
import { tracked } from "@glimmer/tracking";
import { getOwner } from "discourse-common/lib/get-owner";

export default class extends Component {
  @tracked categoryBannerPresence = null;

  constructor() {
    super(...arguments);

    // this prevents a failure if the category banner component is not installed
    this.categoryBannerPresence = getOwner(this).lookup(
      "service:categoryBannerPresence"
    );
  }
}
