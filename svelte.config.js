import adapter from '@sveltejs/adapter-static'; // ✅ 只保留这一个 adapter
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Extensions:
import { mdsvex, escapeSvelte } from 'mdsvex';
import { getHighlighter } from 'shiki';

// Markdown config:
/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md'],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await getHighlighter({
        themes: ['vitesse-dark'],
        langs: ['javascript', 'typescript', 'bash', 'json']
      });
      // 注意：loadLanguage 已经在 langs 中声明过，通常不需要再手动 load
      const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark' }));
      return `{@html \`${html}\` }`;
    }
  }
};

// SvelteKit config:
/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false,
      strict: true
    }),
    alias: {
      '@': './src/*'
    }
  }
};

export default config;
