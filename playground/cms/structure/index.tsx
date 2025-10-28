import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from 'sanity/structure'
import createIFrameView from '../utils/createIFrameView'
import createSingletonStructureItem from '../utils/structure/createSingletonStructureItem'
import pages from './pageStructure'

export const structure: StructureResolver = async (S, context) =>
  S.list()
    .title('Content')
    .items([
      createSingletonStructureItem(S, 'Home', 'home'),
      pages(S, context),
      S.divider(),
      createSingletonStructureItem(S, 'Settings', 'settings'),
      createSingletonStructureItem(S, 'Not Found', 'notFound'),
    ])

export const defaultDocumentNodeResolver: DefaultDocumentNodeResolver = (
  S,
  context,
) => {
  return S.editor()
    .documentId(context.documentId!)
    .schemaType(context.schemaType)
    .views([
      S.view.form(),
      ...(context.schemaType === 'page' ? [createIFrameView(S)] : []),
    ])
}
