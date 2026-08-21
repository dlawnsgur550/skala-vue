import { getCoordinates, jsonResponse } from './_response.js'

const openMeteoAirUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality'

export default {
  async fetch(request) {
    const coordinates = getCoordinates(request)

    if (!coordinates) {
      return jsonResponse({ message: '위도와 경도가 필요합니다.' }, 400)
    }

    const apiUrl = new URL(openMeteoAirUrl)
    apiUrl.searchParams.set('latitude', coordinates.latitude)
    apiUrl.searchParams.set('longitude', coordinates.longitude)
    apiUrl.searchParams.set('current', 'european_aqi,pm10,pm2_5')
    apiUrl.searchParams.set('timezone', 'auto')

    try {
      const apiResponse = await fetch(apiUrl)
      const responseData = await apiResponse.json()

      if (!apiResponse.ok) {
        return jsonResponse({ message: 'Open-Meteo 요청에 실패했습니다.' }, apiResponse.status)
      }

      return jsonResponse(responseData, 200, true)
    } catch {
      return jsonResponse({ message: '대기질 서버에 연결할 수 없습니다.' }, 502)
    }
  },
}
