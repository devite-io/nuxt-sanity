import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'

import { imageHotspotArrayPlugin } from 'sanity-plugin-hotspot-array'
import { media, mediaAssetSource } from 'sanity-plugin-media'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { customDocumentActions } from './plugins/customDocumentActions'
import { schemaTypes } from './schemaTypes'
import { defaultDocumentNodeResolver, structure } from './structure'
import resolveUrl from './utils/resolveUrl'

export default defineConfig({
  name: 'default',
  title: 'nuxt-sanity-demo',

  projectId: 'v797kwt3',
  dataset: 'production',

  plugins: [
    structureTool({ structure, defaultDocumentNode: defaultDocumentNodeResolver }),
    customDocumentActions(),
    imageHotspotArrayPlugin(),
    media(),
    presentationTool({
      resolve: resolveUrl,
      title: 'Visual Editor',
      previewUrl: {
        initial: 'http://localhost:3000',
        previewMode: {
          enable: '/_sanity/preview/enable',
          disable: '/_sanity/preview/disable',
        },
      },
      allowOrigins: ['http://localhost:3000'],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  form: {
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource !== mediaAssetSource,
        )
      },
    },
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource === mediaAssetSource,
        )
      },
    },
  },
})
