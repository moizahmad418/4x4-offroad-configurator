/**
 * Post-build steps needed for GitHub Pages.
 *
 * 1. 404.html — GitHub Pages only serves real files. This app has routes like
 *    /4runner, and there is no 4runner.html on disk, so a direct visit or a page
 *    refresh would hit GitHub's 404. Pages serves our own 404.html for any
 *    unmatched path, so shipping a copy of index.html as 404.html means the app
 *    boots and React Router takes over from the URL.
 *
 * 2. .nojekyll — Pages runs uploads through Jekyll by default, which silently
 *    drops files and folders whose names start with an underscore. This file
 *    turns that off.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, '..', 'dist')

if (!fs.existsSync(dist)) {
	console.error('postbuild: dist/ not found — run the build first.')
	process.exit(1)
}

fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))
fs.writeFileSync(path.join(dist, '.nojekyll'), '')

console.log('Postbuild complete: dist/404.html and dist/.nojekyll written.')
