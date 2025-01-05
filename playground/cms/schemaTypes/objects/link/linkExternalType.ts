import { ArrowTopRightIcon, EarthGlobeIcon } from '@sanity/icons'
import { defineField } from 'sanity'

export const linkExternalType = defineField({
  name: 'linkExternal',
  title: 'External Link',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      title: 'URL',
      name: 'url',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      title: 'Open in a new window?',
      name: 'newWindow',
      type: 'boolean',
      initialValue: true,
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
      url: 'url',
      newWindow: 'newWindow',
    },
    prepare({ url, newWindow }) {
      return {
        media: newWindow ? ArrowTopRightIcon : EarthGlobeIcon,
        title: url,
      }
    },
  },
})
