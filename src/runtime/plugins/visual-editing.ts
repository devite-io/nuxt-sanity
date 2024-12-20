import { useSanityVisualEditingState } from '../composables/useSanityVisualEditingState'
import { useSanityLiveMode } from '../composables/useSanityLiveMode'
import { useSanityVisualEditing } from '../composables/useSanityVisualEditing'
import {
  defineNuxtPlugin, useCookie,
  useRuntimeConfig,
} from '#imports'

export default defineNuxtPlugin(() => {
  const visualEditingState = useSanityVisualEditingState()
  const $config = useRuntimeConfig()
  const { visualEditing } = $config.public.sanity

  if (import.meta.server) {
    if (visualEditing?.previewMode) {
      const previewModeCookie = useCookie('__sanity_preview')

      visualEditingState.enabled = visualEditing.previewModeId === previewModeCookie.value
    }
  }
  else if (visualEditingState.enabled && visualEditing.mode !== 'custom') {
    switch (visualEditing?.mode) {
      case 'live-visual-editing':
      case 'visual-editing':
        useSanityVisualEditing({
          refresh: visualEditing?.refresh,
          zIndex: visualEditing?.zIndex,
        })

        if (visualEditing?.mode === 'live-visual-editing') useSanityLiveMode()
        break
    }
  }
})
