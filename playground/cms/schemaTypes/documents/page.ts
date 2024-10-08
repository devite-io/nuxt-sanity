import { DocumentIcon } from '@sanity/icons'
import { defineField } from 'sanity'

import { validateSlug } from '../../utils/validateSlug'
import { GROUPS, MODULE_TYPES } from '../../constants'

export const pageType = defineField({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'title',
      group: 'editorial',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      group: 'editorial',
      type: 'slug',
      options: { source: 'title' },
      validation: validateSlug,
    }),
    defineField({
      name: 'modules',
      group: 'editorial',
      type: 'array',
      of: MODULE_TYPES,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      seoImage: 'seo.image',
      title: 'title',
    },
    prepare({ seoImage, title }) {
      return {
        media: seoImage ?? DocumentIcon,
        title,
      }
    },
  },
})
