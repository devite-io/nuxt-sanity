import defu from 'defu'
import { useSanityVisualEditingState } from '../composables/useSanityVisualEditingState'
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const visualEditingState = useSanityVisualEditingState()

  const $config = useRuntimeConfig()
  const { visualEditing } = defu($config.sanity, $config.public.sanity)

  if (visualEditing?.previewMode) {
    const previewModeCookie = useCookie('__sanity_preview')

    visualEditingState.enabled = visualEditing.previewModeId === previewModeCookie.value
  }
})
