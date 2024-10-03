import type {
  DocumentActionComponent,
  DocumentActionsResolver,
  NewDocumentOptionsResolver,
} from 'sanity'
import {
  definePlugin,
} from 'sanity'

import { LOCKED_DOCUMENT_TYPES } from '../../constants'

export const resolveDocumentActions: DocumentActionsResolver = (prev, { schemaType }) => {
  if (LOCKED_DOCUMENT_TYPES.includes(schemaType)) {
    prev = prev.filter(
      (previousAction: DocumentActionComponent) =>
        previousAction.action === 'publish' || previousAction.action === 'discardChanges',
    )
  }

  return prev
}

export const resolveNewDocumentOptions: NewDocumentOptionsResolver = (prev) => {
  return prev.filter((previousOption) => !LOCKED_DOCUMENT_TYPES.includes(previousOption.templateId))
}

export const customDocumentActions = definePlugin({
  name: 'custom-document-actions',
  document: {
    actions: resolveDocumentActions,
    newDocumentOptions: resolveNewDocumentOptions,
  },
})
