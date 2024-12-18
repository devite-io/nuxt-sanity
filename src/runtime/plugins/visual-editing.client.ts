import { useSanityVisualEditingState } from '../composables/useSanityVisualEditingState'
import { useSanityLiveMode } from '../composables/useSanityLiveMode'
import { useSanityVisualEditing } from '../composables/useSanityVisualEditing'
import {
  defineNuxtPlugin,
  useRuntimeConfig,
} from '#imports'

export default defineNuxtPlugin(() => {
  if (!useSanityVisualEditingState().enabled) return

  const $config = useRuntimeConfig()
  const { visualEditing } = $config.public.sanity

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
})
