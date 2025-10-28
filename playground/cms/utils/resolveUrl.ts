import { map } from 'rxjs'
import type { DocumentLocationResolver } from 'sanity/presentation'
import { defineDocuments } from 'sanity/presentation'

export default {
  mainDocuments: defineDocuments([
    { route: '/', type: 'home' },
    {
      route: '/:slug',
      filter: `(_type == "page" && slug.current == $slug) || _type == "notFound"`,
    },
  ]),
  locations: ((params, context) => {
    switch (params.type) {
      case 'home':
        return { locations: [{ title: 'Home', href: '/' }] }
      case 'page': {
        const slugDoc = context.documentStore.listenQuery(
          {
            fetch: `*[_id == $id][0] { title, slug }`,
            listen: `*[_id in [$id, $draftId]]`,
          },
          { id: params.id, draftId: `drafts.${params.id}` },
          { perspective: 'drafts' },
        )

        return slugDoc.pipe(
          map((doc) => {
            if (!doc?.slug?.current) return null

            return { locations: [{ title: doc.title, href: `/${doc.slug.current}` }] }
          }),
        )
      }
      case 'notFound':
        return { locations: [{ title: 'Not Found', href: '/404' }] }
      case 'settings':
        return {
          message: 'This document is used on all pages.',
          tone: 'caution',
        }
      default:
        return null
    }
  }) as DocumentLocationResolver,
}
