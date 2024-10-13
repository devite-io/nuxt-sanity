import { addComponentsDir, addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'

export * from './types'

export default defineNuxtModule({
  meta: {
    name: '@devite/nuxt-sanity',
  },
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    await addComponentsDir({ path: resolve('runtime/components') })
    await addComponentsDir({ path: '~/sanity', global: true, prefix: 'Sanity' })

    addImportsDir(resolve('runtime/utils'))
  },
})
