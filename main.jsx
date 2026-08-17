// NOTE: this import must stay first. It installs a three.js URL hook that
// rewrites "/assets/..." paths for sub-folder deployments (GitHub Pages), and
// some modules call useTexture.preload() at import time.
import './utils/assetUrl'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './components/App'

import './assets/styles/global.css'

// Vite's BASE_URL is "/" locally and "/<repo-name>/" on a GitHub Pages project
// site. React Router wants it without the trailing slash.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename={basename}>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/:slug" element={<App />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
