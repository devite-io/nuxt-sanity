import type { Slug } from 'sanity'
import { Iframe, type UrlResolver } from 'sanity-plugin-iframe-pane'
import type { StructureBuilder } from 'sanity/structure'

const resolvePreviewUrl: UrlResolver = (document, _perspective) => {
  return (
    process.env.SANITY_STUDIO_PREVIEW_ORIGIN
    + (document!._type === 'page'
      ? `/${(document!.slug as Slug).current}`
      : document!._type === 'home'
        ? '/'
        : '/404')
  )
}

export default function createIFrameView(S: StructureBuilder) {
  return S.view
    .component(Iframe)
    .options({
      url: resolvePreviewUrl,
      defaultSize: 'desktop',
      reload: { button: true },
      attributes: { allow: 'fullscreen' },
    })
    .title('Preview')
}
