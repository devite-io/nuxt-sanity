import { useSanityVisualEditingState } from '../composables/visual_editing_state'
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const visualEditingState = useSanityVisualEditingState()
  const $config = useRuntimeConfig()
  const previewModeId = $config.sanity.visualEditing?.previewModeId

  if ($config.public.sanity.visualEditing?.previewMode && previewModeId) {
    const previewModeCookie = useCookie('__sanity_preview')

    visualEditingState.enabled = previewModeId === previewModeCookie.value
  }
})
