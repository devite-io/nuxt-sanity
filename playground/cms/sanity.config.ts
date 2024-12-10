import { defineConfig } from 'sanity'

import { imageHotspotArrayPlugin } from 'sanity-plugin-hotspot-array'
import { media, mediaAssetSource } from 'sanity-plugin-media'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { customDocumentActions } from './plugins/customDocumentActions'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'nuxt-sanity-demo',

  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || '',

  plugins: [
    customDocumentActions(),
    structureTool({ structure }),
    imageHotspotArrayPlugin(),
    media(),
    presentationTool({
      title: 'Visual Editor',
      previewUrl: {
        origin: 'http://localhost:3000',
        previewMode: {
          enable: '/_sanity/preview/enable',
          disable: '/_sanity/preview/disable',
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  form: {
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource !== mediaAssetSource)
      },
    },
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource === mediaAssetSource)
      },
    },
  },
})
