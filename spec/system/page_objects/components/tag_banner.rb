# frozen_string_literal: true

module PageObjects
  module Components
    class TagBanner < PageObjects::Components::Base
      SELECTOR = ".tag-banner-container"

      def has_tag_banner?
        has_css?(SELECTOR)
      end

      def has_no_tag_banner?
        has_no_css?(SELECTOR)
      end

      def has_tag_name?(tag)
        has_css?("#{SELECTOR} .tag-title-header h1 span", text: tag.name)
      end

      def has_tag_description?(tag)
        has_css?("#{SELECTOR} .tag-title-header p", text: tag.description)
      end
    end
  end
end
