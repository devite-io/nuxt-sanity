import { CogIcon } from '@sanity/icons/Cog'
import { SearchIcon } from '@sanity/icons/Search'
import { defineField, defineType } from 'sanity'

const TITLE = 'Settings'

export const settingsType = defineType({
  name: 'settings',
  title: TITLE,
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      default: true,
      name: 'seo',
      title: 'SEO',
      icon: SearchIcon,
    },
  ],
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'globalSEO',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      }
    },
  },
})
