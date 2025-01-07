import type { ModuleOptions } from '@devite/nuxt-sanity'
import { useSanityVisualEditingState } from '../composables/useSanityVisualEditingState'
import type DefaultSanityClient from '../client/DefaultSanityClient'
import useSanityClient from '../utils/useSanityClient'
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(async () => {
  const visualEditingState = useSanityVisualEditingState()
  const $config = useRuntimeConfig()
  const { visualEditing } = $config.public.sanity as ModuleOptions

  if (import.meta.server) {
    const previewModeId = $config.sanity.visualEditing.previewModeId

    if (visualEditing?.previewMode && previewModeId) {
      const previewModeCookie = useCookie('__sanity_preview')

      visualEditingState.enabled = previewModeId === previewModeCookie.value
    }
  }
  else if (visualEditingState.enabled) {
    switch (visualEditing?.mode) {
      case 'live-visual-editing':
      case 'visual-editing':
        import('../utils/visualEditing/enableVisualEditing').then(({ enableVisualEditing }) => enableVisualEditing({
          refresh: visualEditing?.refresh,
          zIndex: visualEditing?.zIndex,
        }))

        if (visualEditing?.mode === 'live-visual-editing') {
          const client = await useSanityClient(true, 'default', $config.public.sanity as ModuleOptions) as DefaultSanityClient

          client.queryStore?.enableLiveMode({ client: client.client })
        }
        break
    }
  }
})
