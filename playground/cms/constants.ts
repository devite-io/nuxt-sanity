import { ComposeIcon, SearchIcon } from '@sanity/icons'

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = ['settings', 'home', 'notFound', 'media.tag']

// References to include in 'internal' links
export const PAGE_REFERENCES = [{ type: 'home' }, { type: 'page' }]

// Field groups used through schema types
export const GROUPS = [
  {
    default: true,
    name: 'editorial',
    title: 'Editorial',
    icon: ComposeIcon,
  },
  {
    name: 'seo',
    title: 'SEO',
    icon: SearchIcon,
  },
]
