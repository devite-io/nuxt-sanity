import { createError, defineEventHandler, getCookie, readBody } from 'h3'
import useSanityClient from '../utils/useSanityClient'
import type DefaultSanityClient from '../../client/DefaultSanityClient'

export default defineEventHandler(async (event) => {
  const previewModeCookie = getCookie(event, '__sanity_preview')

  if (!previewModeCookie) {
    return createError({
      status: 403,
      statusText: 'This route is only available in preview mode',
    })
  }

  const { query, params = {}, options } = await readBody(event)

  if (!query) {
    return createError({
      status: 400,
      statusText: `Field "query" is required`,
    })
  }

  return (await useSanityClient('default') as DefaultSanityClient).fetch(
    query, params, options ?? undefined,
  )
})
