import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
    plugins: [tailwindcss(), sveltekit(), Icons({ compiler: 'svelte' })],
    resolve: {
        alias: {
            $components: resolve('src/components'),
            $game: resolve('src/game'),
        },
    },
})
