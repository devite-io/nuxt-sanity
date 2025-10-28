import { linkExternalType } from './annotations/link/linkExternalType'
import { linkInternalType } from './annotations/link/linkInternalType'
import { sectionDemoType } from './blocks/module/section/demoType'

import { globalSEOType } from './globalBlocks/settings/globalSEOType'

import { seoType } from './globalBlocks/seoType'
import { richTextType } from './globalBlocks/richTextType'
import { imageBlockType } from './globalBlocks/imageBlockType'
import { homeType } from './singletons/homeType'
import { notFoundType } from './singletons/notFoundType'
import { settingsType } from './singletons/settingsType'

import { pageType } from './documents/page'

// annotations must be imported first
const annotations = [linkExternalType, linkInternalType]

const globalBlocks = [
  // settings
  globalSEOType,
  // others
  seoType,
  richTextType,
  imageBlockType,
]

const blocks = [
  // sections
  sectionDemoType,
]

const singletons = [homeType, notFoundType, settingsType]

const documents = [pageType]

export const schemaTypes = [
  ...annotations,
  ...globalBlocks,
  ...blocks,
  ...singletons,
  ...documents,
]
