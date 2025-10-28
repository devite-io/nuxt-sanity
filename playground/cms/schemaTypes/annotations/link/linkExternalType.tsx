import { ArrowTopRightIcon, EarthGlobeIcon } from '@sanity/icons'
import { defineField } from 'sanity'

export const linkExternalType = defineField({
  name: 'linkExternal',
  title: 'External Link',
  type: 'object',
  icon: EarthGlobeIcon,
  components: {
    annotation: (props) => (
      <span>
        <EarthGlobeIcon
          style={{
            marginLeft: '0.05em',
            marginRight: '0.1em',
            width: '0.75em',
          }}
        />
        {props.renderDefault(props)}
      </span>
    ),
  },
  fields: [
    defineField({
      title: 'URL',
      name: 'url',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https', 'tel', 'mailto', 'whatsapp'],
          allowRelative: true,
        }),
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
      initialValue: 'noreferrer noopener nofollow',
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
