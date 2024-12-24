import { createHmac } from 'node:crypto'
import { defineEventHandler, readRawBody, setResponseStatus, getRequestHeader } from 'h3'
import { useRuntimeConfig, useStorage } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event)
  const signatureHeader = getRequestHeader(event, 'sanity-webhook-signature')
  const signatureParts = signatureHeader?.split(',')

  if (!signatureParts || signatureParts.length !== 2) {
    return setResponseStatus(event, 400, 'Invalid signature')
  }

  const timestamp = Number.parseInt(signatureParts[0].slice(2), 10)
  const signature = signatureParts[1].slice(3)

  const encoder = new TextEncoder()
  const secret = useRuntimeConfig().sanity.webhookSecret
  const expectedSignature = createHmac('sha256', encoder.encode(secret))
    .update(`${timestamp}.${body}`)
    .digest('base64')
  const expectedSignatureUrl = expectedSignature
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  if (signature !== expectedSignatureUrl) {
    return setResponseStatus(event, 403)
  }

  const { _id } = JSON.parse(body || '{}')

  const sanityDocumentDeps = useStorage('sanityDocumentDeps')
  const documentDeps = (await sanityDocumentDeps.getItem(_id)) as string[] | undefined

  if (documentDeps && documentDeps?.length > 0) {
    const dataCache = useStorage('sanityData')

    await Promise.all(documentDeps.map((key) => dataCache.removeItem(key)))
    await dataCache.dispose()
  }

  await sanityDocumentDeps.removeItem(_id)
  await sanityDocumentDeps.dispose()

  setResponseStatus(event, 204)
})
