import { defineField } from 'sanity'

export const globalSEOType = defineField({
  name: 'globalSEO',
  title: 'Global SEO',
  type: 'object',
  group: 'globalSEO',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'siteName',
      type: 'string',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { metadata: [] },
    }),
  ],
})
