import type { DisableVisualEditing, VisualEditingOptions } from '@sanity/visual-editing'
import { enableVisualEditing } from '@sanity/visual-editing'
import type { SanityVisualEditingRefreshHandler } from '@devite/nuxt-sanity'
import type { Router } from 'vue-router'
import { onScopeDispose } from 'vue'
import { reloadNuxtApp, useRouter } from '#imports'

export interface VisualEditingProps {
  refresh?: SanityVisualEditingRefreshHandler
  zIndex?: VisualEditingOptions['zIndex']
}

/** @return A function to disable visual editing */
export const useSanityVisualEditing = (options: VisualEditingProps = {}): DisableVisualEditing => {
  const { refresh, zIndex } = options
  let disable = () => {}

  if (import.meta.client) {
    const router: Router = useRouter()

    disable = enableVisualEditing({
      zIndex,
      refresh: (payload) => {
        function refreshDefault() {
          if (payload.source === 'mutation' && payload.livePreviewEnabled)
            return false

          return new Promise<void>((resolve) => {
            reloadNuxtApp({ ttl: 1_000 })
            resolve()
          })
        }

        return refresh ? refresh(payload, refreshDefault) : refreshDefault()
      },
      history: {
        subscribe(navigate) {
          router.isReady().then(() => navigate({ type: 'replace', url: router.currentRoute.value.fullPath }))

          return router.afterEach((to) => navigate({ type: 'push', url: to.fullPath }))
        },
        update(update) {
          switch (update.type) {
            case 'push':
            case 'replace':
              router[update.type](update.url)
              break
            case 'pop':
              router.back()
              break
          }
        },
      },
    })
  }

  onScopeDispose(disable)

  return disable
}
