import { DocumentsIcon } from '@sanity/icons'
import type { ListItemBuilder } from 'sanity/structure'
import defineStructure from '../utils/structure/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem().title('Pages').icon(DocumentsIcon).schemaType('page').child(S.documentTypeList('page')),
)
