import { tracked } from "@glimmer/tracking";
import { getOwner } from "@ember/application";
import Component from "@ember/component";

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
