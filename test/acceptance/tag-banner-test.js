import { visit } from "@ember/test-helpers";
import { test } from "qunit";
import { cloneJSON } from "discourse/lib/object";
import discoveryFixture from "discourse/tests/fixtures/discovery-fixtures";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";

acceptance("Tag Banners | tag route", function (needs) {
  needs.settings({ tagging_enabled: true });

  needs.pretender((server, helper) => {
    const discoveryResponse = () => {
      return helper.response(
        cloneJSON(discoveryFixture["/tag/important/l/latest.json"])
      );
    };

    server.get("/tag/:tag_identifier/l/latest.json", discoveryResponse);

    const tagInfoResponse = () => {
      return helper.response({
        tag_info: {
          id: 1,
          name: "important",
          slug: "important",
          description: "Important topics",
          topic_count: 5,
          pm_only: false,
        },
        categories: [],
        tag_group_names: [],
      });
    };

    server.get("/tag/:tag_name/info", tagInfoResponse);
    server.get("/tag/:tag_name/info.json", tagInfoResponse);
    server.get("/tag/:tag_id/info.json", tagInfoResponse);
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
