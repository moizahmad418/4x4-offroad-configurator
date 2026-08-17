import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import glsl from 'vite-plugin-glsl'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    // Where the site will live once deployed.
    //   "/"              -> custom domain, Netlify, or a <user>.github.io repo
    //   "/<repo-name>/"  -> a normal GitHub Pages project repo
    // The GitHub Actions workflow sets VITE_BASE automatically, so you normally
    // never have to touch this.
    base: process.env.VITE_BASE || '/',

    plugins: [
        react(),
        tailwindcss(),
        svgr({
            include: '**/*.svg',
        }),
        glsl(),
        // https dev server, needed for WebXR on a phone. Dev only.
        ...(command === 'serve' ? [basicSsl()] : []),
    ],
    server: {
        host: true,
    },
    resolve: {
        dedupe: ['three', 'three-stdlib'],
    },
}))
