import { defineArrayMember, defineField } from 'sanity'

export const richTextType = defineField({
  name: 'richText',
  type: 'array',
  of: [
    defineArrayMember({
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          {
            title: 'Italic',
            value: 'em',
          },
          {
            title: 'Strong',
            value: 'strong',
          },
        ],
        annotations: [
          {
            name: 'linkInternal',
            type: 'linkInternal',
          },
          {
            name: 'linkExternal',
            type: 'linkExternal',
          },
        ],
      },
      type: 'block',
    }),
  ],
})
