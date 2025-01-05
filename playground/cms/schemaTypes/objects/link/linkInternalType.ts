import { LinkIcon } from '@sanity/icons'
import { defineField } from 'sanity'
import { PAGE_REFERENCES } from '../../../constants'

export const linkInternalType = defineField({
  name: 'linkInternal',
  title: 'Internal Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'reference',
      type: 'reference',
      validation: (Rule) => Rule.required(),
      to: PAGE_REFERENCES,
    }),
    defineField({
      name: 'linkTitle',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relationship',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      slug: 'reference.slug.current',
    },
    prepare({ slug }) {
      return {
        title: `/${slug || ''}`,
      }
    },
  },
})
