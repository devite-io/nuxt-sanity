import type { ModuleOptions } from '@devite/nuxt-sanity'
import { useSanityVisualEditingState } from '../composables/visual_editing_state'
import useSanityClient from '../utils/useSanityClient'
import type DefaultSanityClient from '../client/DefaultSanityClient'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  if (!useSanityVisualEditingState().enabled) return

  const $config = useRuntimeConfig()
  const { visualEditing } = $config.public.sanity as ModuleOptions

  switch (visualEditing?.mode) {
    case 'live-visual-editing':
    case 'visual-editing':
      import('../utils/visualEditing/enableVisualEditing').then(({ enableVisualEditing }) => enableVisualEditing({
        refresh: visualEditing?.refresh,
        zIndex: visualEditing?.zIndex,
      }))

      if (visualEditing?.mode === 'live-visual-editing') {
        (useSanityClient(true, 'default', $config.public.sanity as ModuleOptions) as Promise<DefaultSanityClient>).then((client) => {
          client.queryStore?.enableLiveMode({ client: client.client })
        })
      }
      break
  }
})
