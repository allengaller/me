import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://allengaller.github.io',
  base: '/',
  trailingSlash: 'ignore',
  build: {
    format: 'file',
    inlineStylesheets: 'auto'
  },
  compressHTML: true
});
