import { ErrorOutlineIcon } from '@sanity/icons'
import { defineField } from 'sanity'
import { GROUPS, MODULE_TYPES } from '../../constants'

const TITLE = 'Not Found'

export const notFoundType = defineField({
  name: 'notFound',
  title: TITLE,
  type: 'document',
  icon: ErrorOutlineIcon,
  groups: GROUPS,
  fields: [
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
    prepare() {
      return {
        media: ErrorOutlineIcon,
        subtitle: 'Not Found',
        title: TITLE,
      }
    },
  },
})
