// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // rules for module authors
    tooling: true,
    // rules for formatting
    stylistic: {
      arrowParens: true,
    },
  },
  dirs: {
    src: ['./playground'],
  },
}).append(
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'regexp/strict': 'off',
    },
  },
  {
    ignores: ['**/.sanity'],
  },
)
