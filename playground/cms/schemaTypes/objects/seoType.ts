import { defineField } from 'sanity'

export const seoType = defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  group: 'seo',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'indexable',
      type: 'boolean',
      description: 'Allow search engines to index this page',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: Rule =>
        Rule.max(50).warning('Longer titles may be truncated by search engines').required(),
    }),
    defineField({
      name: 'shortTitle',
      title: 'Short Title',
      type: 'string',
      description: 'A short, descriptive title for sharing on social media',
      validation: Rule =>
        Rule.max(50).warning('Longer titles may be truncated by some platforms').required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      validation: Rule =>
        Rule.max(150).warning('Longer descriptions may be truncated by search engines').required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { metadata: [] },
    }),
  ],
})
