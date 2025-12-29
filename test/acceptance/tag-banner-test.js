import { visit } from "@ember/test-helpers";
import { test } from "qunit";
import { cloneJSON } from "discourse/lib/object";
import discoveryFixture from "discourse/tests/fixtures/discovery-fixtures";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";

acceptance("Tag Banners | tag route", function (needs) {
  needs.settings({ tagging_enabled: true });

  needs.pretender((server, helper) => {
    server.get("/tag/important/l/latest.json", () => {
      return helper.response(
        cloneJSON(discoveryFixture["/tag/important/l/latest.json"])
      );
    });

    server.get("/tag/:tag_name/info", () => {
      return helper.response({
        tag_info: {
          id: 1,
          name: "important",
          description: "Important topics",
          topic_count: 5,
          pm_only: false,
        },
        categories: [],
        tag_group_names: [],
      });
    });
  });

  test("displays banner when visiting a tag route", async function (assert) {
    await visit("/tag/important");

    assert
      .dom(".tag-banner-container")
      .exists("tag banner container is present");
  });

  test("displays the tag name in the banner", async function (assert) {
    await visit("/tag/important");

    assert
      .dom(".tag-banner-container")
      .includesText("important", "tag name is displayed in the banner");
  });
});
