import { defineField } from 'sanity'

export const sectionDemoType = defineField({
  name: 'sectionDemo',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'richText',
    }),
    defineField({
      name: 'image',
      type: 'imageBlock',
    }),
  ],
})
