import type { ModuleOptions } from '@devite/nuxt-sanity'
import { useSanityVisualEditingState } from '../composables/useSanityVisualEditingState'
import { useSanityLiveMode } from '../composables/useSanityLiveMode'
import { useSanityVisualEditing } from '../composables/useSanityVisualEditing'
import {
  defineNuxtPlugin, useCookie,
  useRuntimeConfig,
} from '#imports'

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
  else if (visualEditingState.enabled && visualEditing?.mode !== 'custom') {
    switch (visualEditing?.mode) {
      case 'live-visual-editing':
      case 'visual-editing':
        useSanityVisualEditing({
          refresh: visualEditing?.refresh,
          zIndex: visualEditing?.zIndex,
        })

        if (visualEditing?.mode === 'live-visual-editing') await useSanityLiveMode()
        break
    }
  }
})
