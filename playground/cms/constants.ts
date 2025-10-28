import { ComposeIcon, SearchIcon } from '@sanity/icons'

// document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = ['settings', 'home', 'notFound', 'media.tag']

// references to include in 'internal' links
export const PAGE_REFERENCES = [{ type: 'home' }, { type: 'page' }]

// modules that can be added to pages
export const MODULE_TYPES = [{ type: 'imageBlock' }, { type: 'sectionDemo' }]

// document groups
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
