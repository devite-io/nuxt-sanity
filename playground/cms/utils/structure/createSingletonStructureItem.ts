import type { StructureBuilder } from 'sanity/structure'

export default function createSingletonStructureItem(
  S: StructureBuilder,
  title: string,
  schemaType: string,
) {
  return S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(
      S.editor().title(title).schemaType(schemaType).documentId(schemaType),
    )
}
