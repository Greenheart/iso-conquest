import {vitePreprocess} from '@sveltejs/vite-plugin-svelte'
import adapter from '@sveltejs/adapter-static'
import {resolve} from 'node:path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            $game: resolve('./src/game'),
            $components: resolve('./src/components'),
        }
    },
}

export default config
