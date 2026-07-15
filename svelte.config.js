import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    // Project Pages serve under /<repo>; dev + preview keep the root.
    paths: { base: process.env.NODE_ENV === 'production' ? '/foxloves_manual' : '' },
    prerender: { entries: ['*'] }
  }
};
