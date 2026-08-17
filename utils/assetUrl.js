/**
 * Asset URL handling for deployments that live in a sub-folder.
 *
 * On Netlify / a custom domain the site is served from "/", so a path like
 * "/assets/models/foo.glb" resolves correctly.
 *
 * On GitHub Pages a *project* site is served from "/<repo-name>/", so that same
 * path would 404. Vite rewrites paths it can see at build time (imports, CSS,
 * index.html), but it cannot rewrite plain strings that are only used at runtime
 * — and this project loads all of its 3D models and textures from such strings.
 *
 * Rather than editing ~95 call sites, we hook three.js's DefaultLoadingManager,
 * which every loader in this app uses, and prefix the base path there.
 *
 * import.meta.env.BASE_URL is set by Vite from the `base` option and always ends
 * with a slash (e.g. "/" or "/4x4builder/").
 */

import { DefaultLoadingManager } from 'three'

const BASE = import.meta.env.BASE_URL || '/'

/** Prefix a root-relative app path with the deployment base path. */
export const withBase = (path) => {
	if (typeof path !== 'string' || !path.startsWith('/')) return path
	if (BASE === '/') return path
	// Already prefixed (e.g. a texture resolved relative to an already-prefixed .glb)
	if (path.startsWith(BASE)) return path
	return BASE + path.slice(1)
}

// Only install the hook when we're actually served from a sub-folder.
if (BASE !== '/') {
	DefaultLoadingManager.setURLModifier((url) => {
		// Leave blob:, data:, and fully-qualified URLs alone.
		if (typeof url !== 'string' || !url.startsWith('/')) return url
		return withBase(url)
	})
}

export default withBase
