# frozen_string_literal: true

require_relative "page_objects/components/tag_banner"

RSpec.describe "Tag banner", system: true do
  let!(:theme) { upload_theme_component }

  fab!(:tag) { Fabricate(:tag, name: "important", description: "Important topics") }

  let(:tag_banner) { PageObjects::Components::TagBanner.new }

  before { SiteSetting.tagging_enabled = true }

  it "displays the tag banner with name and description" do
    visit("/tag/#{tag.name}")

    expect(tag_banner).to have_tag_banner
    expect(tag_banner).to have_tag_name(tag)
    expect(tag_banner).to have_tag_description(tag)
  end

  it "does not display the banner for the none tag filter" do
    visit("/tag/none")

    expect(tag_banner).to have_no_tag_banner
  end
end
