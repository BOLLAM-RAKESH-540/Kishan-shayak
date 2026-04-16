import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Kisan Sahayak',
        short_name: 'KisanApp',
        description: 'Your Smart Farming Assistant',
        theme_color: '#064e3b',
        icons: [
          {
            src: '/icons/farm.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/farm.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        display: 'standalone',
        background_color: '#ffffff',
        start_url: '/',
        scope: '/',
        orientation: 'portrait'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.bigdatacloud\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'kisan-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          }
        ]
      }
    })
  ],
})
