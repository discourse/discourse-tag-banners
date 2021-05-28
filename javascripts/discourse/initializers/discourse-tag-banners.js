import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-tag-banners",

  initialize() {
    withPluginApi("0.8", (api) => {
      api.decorateWidget("tag-header-widget:after", (helper) => {
        helper.widget.appEvents.on("page:changed", () => {
          helper.widget.scheduleRerender();
        });
      });
    });
  },
};
