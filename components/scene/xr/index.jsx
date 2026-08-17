import { lazy, Suspense, useState, useEffect, useRef } from 'react'

// Lazy load the full XR provider - only loaded when XR is available
const XRManager = lazy(() => import('./XRManager'))

// Module-level cache for XR support check - prevents re-checking and re-renders
let xrSupportPromise = null
let xrSupportResult = null

const getXRSupport = () => {
	// Return cached result if already resolved
	if (xrSupportResult !== null) return xrSupportResult

	// Start check if not already started
	if (!xrSupportPromise) {
		if (!navigator.xr) {
			xrSupportResult = false
			return false
		}
		xrSupportPromise = navigator.xr
			.isSessionSupported('immersive-vr')
			.then((supported) => {
				xrSupportResult = supported
				return supported
			})
			.catch(() => {
				xrSupportResult = false
				return false
			})
	}

	return null // Still checking
}

/**
 * XR - conditionally loads XR support only when WebXR is available.
 * This keeps the XR bundle out of the main bundle for non-VR users.
 *
 * When XR is not supported, children render directly without any XR overhead.
 * When XR is supported, children are wrapped with lazy-loaded XR context and controllers.
 */
const XR = ({ children }) => {
	// Check synchronous cache first - avoids any state updates if already resolved
	const cachedResult = getXRSupport()

	// Only use state if we need to wait for the async check
	const [xrSupported, setXrSupported] = useState(cachedResult)
	const hasChecked = useRef(cachedResult !== null)

	useEffect(() => {
		// Skip if already have a result (either from cache or previous check)
		if (hasChecked.current) return

		// Wait for the promise to resolve
		if (xrSupportPromise) {
			xrSupportPromise.then((supported) => {
				hasChecked.current = true
				// Only update state if XR IS supported - avoids re-render for non-XR devices
				if (supported) {
					setXrSupported(true)
				}
			})
		}
	}, [])

	// If XR not supported (or still checking), just render children directly
	if (!xrSupported) {
		return <>{children}</>
	}

	// XR supported - wrap with lazy-loaded XRManager
	return (
		<Suspense fallback={<>{children}</>}>
			<XRManager>{children}</XRManager>
		</Suspense>
	)
}

export default XR
