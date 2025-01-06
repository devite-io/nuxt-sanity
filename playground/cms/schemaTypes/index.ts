import { linkExternalType } from './objects/link/linkExternalType'
import { linkInternalType } from './objects/link/linkInternalType'

import { globalSEOType } from './objects/global/globalSEOType'
import { seoType } from './objects/seoType'

import { richTextType } from './richText/richTextType'
import { imageBlockType } from './objects/module/imageBlockType'
import { demoSectionType } from './objects/module/demoSectionType'

import { pageType } from './documents/page'

import { homeType } from './singletons/homeType'
import { notFoundType } from './singletons/notFoundType'
import { settingsType } from './singletons/settingsType'

// objects used as annotations must be imported first
const annotations = [linkExternalType, linkInternalType]

const objects = [globalSEOType, seoType]

const blocks = [richTextType, imageBlockType, demoSectionType]

const documents = [pageType]

const singletons = [homeType, notFoundType, settingsType]

export const schemaTypes = [...annotations, ...objects, ...singletons, ...blocks, ...documents]
