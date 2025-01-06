import type { ListItemBuilder, StructureResolver } from 'sanity/structure'
import home from './homeStructure'
import notFound from './notFoundStructure'
import pages from './pageStructure'
import settings from './settingStructure'

// if you add document types to structure manually, you can add them to this function to prevent duplicates in the root pane
const hiddenDocTypes = (listItem: ListItemBuilder) => {
  const id = listItem.getId()

  if (!id) return false

  return !['collection', 'home', 'notFound', 'media.tag', 'page', 'settings'].includes(id)
}

export const structure: StructureResolver = (S, context) => {
  const subItems: ListItemBuilder[] = S.documentTypeListItems().filter(hiddenDocTypes)

  return S.list()
    .title('Content')
    .items([
      home(S, context),
      notFound(S, context),
      pages(S, context),
      S.divider(),
      settings(S, context),
      ...(subItems.length ? [S.divider(), ...subItems] : []),
    ])
}
