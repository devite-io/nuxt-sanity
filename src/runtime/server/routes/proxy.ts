import { createError, defineEventHandler, getCookie, readBody } from 'h3'
import useSanityClient from '../utils/useSanityClient'

export default defineEventHandler(async (event) => {
  const previewModeCookie = getCookie(event, '__sanity_preview')

  if (!previewModeCookie) {
    return createError({
      statusCode: 403,
      statusMessage: 'This route is only available in preview mode',
    })
  }

  const { query, params = {} } = await readBody(event)

  if (!query) {
    return createError({
      statusCode: 400,
      statusMessage: `Field "query" is required`,
    })
  }

  return await useSanityClient('default').fetch(query, params)
})
