import { reactive } from 'vue'
import { useState } from '#imports'

export default function useSanityVisualEditingState() {
  const enabled = useState('_sanity_visualEditing', () => false)

  return reactive({
    enabled,
    isInFrame() {
      if (import.meta.server) return undefined

      return !!(window.self !== window.top || window.opener)
    },
  })
}
