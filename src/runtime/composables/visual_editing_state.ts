import { reactive } from 'vue'
import { useState } from '#imports'

export const useSanityVisualEditingState = () => {
  const enabled = useState('_sanity_visual_editing', () => false)

  return reactive({
    enabled,
    isInFrame() {
      if (import.meta.server) return undefined

      return !!(window.self !== window.top || window.opener)
    },
  })
}
