import { getCoordinates, jsonResponse } from './_response.js'

const openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5'

export const requestOpenWeather = async (request, endpoint) => {
  const coordinates = getCoordinates(request)

  if (!coordinates) {
    return jsonResponse({ message: '위도와 경도가 필요합니다.' }, 400)
  }

  if (!process.env.OPENWEATHER_API_KEY) {
    return jsonResponse({ message: '서버 API 키가 설정되지 않았습니다.' }, 500)
  }

  const apiUrl = new URL(`${openWeatherBaseUrl}/${endpoint}`)
  apiUrl.searchParams.set('lat', coordinates.latitude)
  apiUrl.searchParams.set('lon', coordinates.longitude)
  apiUrl.searchParams.set('appid', process.env.OPENWEATHER_API_KEY)
  apiUrl.searchParams.set('units', 'metric')

  try {
    const apiResponse = await fetch(apiUrl)
    const responseData = await apiResponse.json()

    if (!apiResponse.ok) {
      return jsonResponse({ message: 'OpenWeatherMap 요청에 실패했습니다.' }, apiResponse.status)
    }

    return jsonResponse(responseData, 200, true)
  } catch {
    return jsonResponse({ message: '날씨 서버에 연결할 수 없습니다.' }, 502)
  }
}
