import { defineField } from 'sanity'

export const imageBlockType = defineField({
  name: 'imageBlock',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: { metadata: ['lqip'] },
    }),
    defineField({
      name: 'lazy',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
