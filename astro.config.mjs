import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yourusername.dev',
  base: '/',
  trailingSlash: 'ignore',
  build: {
    format: 'file',
    inlineStylesheets: 'auto'
  },
  compressHTML: true,
  vite: {
    optimizeDeps: {
      exclude: ['aria-query', 'axobject-query']
    }
  }
});
