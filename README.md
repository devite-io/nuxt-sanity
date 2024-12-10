# Nuxt Sanity Integration

[![npm version][npm-version-src]][npm-version-href]

Advanced [Sanity](https://www.sanity.io/) integration for Nuxt.js. Based on the official [@nuxtjs/sanity][nuxt-sanity] module.

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add @devite/nuxt-sanity
```

That's it! You can now use Sanity with your Nuxt app ✨


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm dev:prepare
  
  # Generate module types and build the module
  pnpm prepack
  
  # Develop with the playground
  pnpm dev
  
  # Build the playground
  pnpm dev:build
  
  # Run ESLint
  pnpm lint
  
  # Run Vitest
  pnpm test
  pnpm test:watch
  
  # Release new version
  pnpm release
  ```
</details>

<!-- Links -->
[nuxt-sanity]: https://github.com/nuxt-modules/sanity

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@devite/nuxt-sanity/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@devite/nuxt-sanity
