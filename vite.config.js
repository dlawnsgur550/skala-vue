import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import currentWeatherApi from './api/weather.js'
import forecastApi from './api/forecast.js'
import airQualityApi from './api/air-quality.js'

const localApiHandlers = {
  '/api/weather': currentWeatherApi,
  '/api/forecast': forecastApi,
  '/api/air-quality': airQualityApi,
}

const localApiPlugin = () => {
  return {
    name: 'local-vercel-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestUrl = new URL(request.url, `http://${request.headers.host}`)
        const apiHandler = localApiHandlers[requestUrl.pathname]

        if (!apiHandler) {
          next()
          return
        }

        try {
          const apiResponse = await apiHandler.fetch(new Request(requestUrl))
          const responseBody = Buffer.from(await apiResponse.arrayBuffer())

          response.statusCode = apiResponse.status
          apiResponse.headers.forEach((value, key) => response.setHeader(key, value))
          response.end(responseBody)
        } catch {
          response.statusCode = 500
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(JSON.stringify({ message: '로컬 API 서버 실행에 실패했습니다.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.OPENWEATHER_API_KEY = env.OPENWEATHER_API_KEY

  return {
    plugins: [vue(), vueDevTools(), localApiPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
