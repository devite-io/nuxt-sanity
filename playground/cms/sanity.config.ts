import { defineConfig } from 'sanity'

import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { customDocumentActions } from './plugins/customDocumentActions'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'nuxt-sanity-demo',

  projectId: 'v797kwt3',
  dataset: 'production',

  plugins: [
    customDocumentActions(),
    structureTool({ structure }),
    presentationTool({
      title: 'Preview',
      previewUrl: {
        origin: 'http://localhost:3000',
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable',
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
