import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const { VITE_SITE_URL: configuredUrl = '' } = loadEnv(mode, process.cwd(), 'VITE_')
  let siteUrl = ''
  if (configuredUrl) {
    const url = new URL(configuredUrl)
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
      throw new Error('VITE_SITE_URL must be the verified HTTPS site origin, without a path, credentials, query or hash.')
    }
    siteUrl = url.origin
  }
  return {
    plugins: [react(), {
      name: 'havenza-social-origin',
      transformIndexHtml(html) {
        if (!siteUrl) return html
        // Absolute image URLs are inserted into the actual HTML for social crawlers.
        return html.replaceAll('content="/social-preview.png"', `content="${siteUrl}/social-preview.png"`)
      },
    }],
  }
})
