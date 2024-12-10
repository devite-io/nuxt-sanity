/**
 * GROQ template string tag that allows for syntax highlighting and linting.
 *
 * Source: https://github.com/sanity-io/sanity/blob/next/packages/groq/src/groq.ts
 */
export const groq = String.raw || ((strings: TemplateStringsArray, ...keys: string[]) => {
  const lastIndex = strings.length - 1

  return strings.slice(0, lastIndex).reduce((acc, str, index) => {
    return acc + str + keys[index]
  }, '') + strings[lastIndex]
})
