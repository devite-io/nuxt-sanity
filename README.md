# Nuxt Sanity Integration

[![npm version][npm-version-src]][npm-version-href]

Provides additional helper components and utilities for the [Nuxt Sanity Module][nuxt-sanity].

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add @devite/nuxt-sanity
```

That's it! You can now use data from Sanity in your Nuxt app ✨


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install && cd playground/cms && pnpm install
  
  # Generate type stubs
  pnpm dev:prepare
  
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
