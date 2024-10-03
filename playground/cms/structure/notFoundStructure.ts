import type { ListItemBuilder } from 'sanity/structure'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Not Found')
    .schemaType('notFound')
    .child(S.editor().title('Not Found').schemaType('notFound').documentId('notFound')),
)
