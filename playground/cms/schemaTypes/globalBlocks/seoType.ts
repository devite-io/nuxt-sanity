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
      name: 'priority',
      type: 'number',
      description:
        'A number between 0 and 1 indicating the priority of this page',
      initialValue: 0.5,
    }),
    defineField({
      name: 'changeFreq',
      title: 'Change Frequency',
      type: 'string',
      options: {
        list: ['always', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
      },
      initialValue: 'weekly',
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) =>
        Rule.max(50)
          .warning('Longer titles may be truncated by search engines')
          .required(),
    }),
    defineField({
      name: 'shortTitle',
      title: 'Short Title',
      type: 'string',
      description: 'A short, descriptive title for sharing on social media',
      validation: (Rule) =>
        Rule.max(50)
          .warning('Longer titles may be truncated by some platforms')
          .required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      validation: (Rule) =>
        Rule.max(150)
          .warning('Longer descriptions may be truncated by search engines')
          .required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { metadata: [] },
    }),
  ],
})
