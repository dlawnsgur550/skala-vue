import axios from 'axios'

const getWeatherStatus = (weatherId) => {
  if (weatherId >= 200 && weatherId < 600) return 'rain'
  if (weatherId >= 600 && weatherId < 700) return 'snow'
  if (weatherId >= 700 && weatherId < 800) return 'atmosphere'
  if (weatherId === 800) return 'sunny'
  return 'cloudy'
}

const getWeatherIcon = (weatherId) => {
  if (weatherId >= 200 && weatherId < 600) return '🌧️'
  if (weatherId >= 600 && weatherId < 700) return '🌨️'
  if (weatherId >= 700 && weatherId < 800) return '🌫️'
  if (weatherId === 800) return '☀️'
  return '☁️'
}

export const fetchCurrentWeather = async (city) => {
  const response = await axios.get('/api/weather', {
    params: {
      lat: city.latitude,
      lon: city.longitude,
    },
  })

  const weatherId = response.data.weather[0].id

  return {
    ...city,
    temp: Math.round(response.data.main.temp),
    humidity: response.data.main.humidity,
    wind: `${response.data.wind.speed}m/s`,
    status: getWeatherStatus(weatherId),
    icon: getWeatherIcon(weatherId),
    observedAt: response.data.dt,
  }
}

export const fetchFiveDayForecast = async (city) => {
  const response = await axios.get('/api/forecast', {
    params: {
      lat: city.latitude,
      lon: city.longitude,
    },
  })

  const forecastList = []
  const savedDates = []

  response.data.list.forEach((item) => {
    const forecastDate = item.dt_txt.split(' ')[0]

    if (!savedDates.includes(forecastDate) && forecastList.length < 5) {
      const weatherId = item.weather[0].id
      savedDates.push(forecastDate)
      forecastList.push({
        date: forecastDate,
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        status: getWeatherStatus(weatherId),
        icon: getWeatherIcon(weatherId),
      })
    }
  })

  return forecastList
}

export const fetchAirQuality = async (city) => {
  const response = await axios.get('/api/air-quality', {
    params: {
      lat: city.latitude,
      lon: city.longitude,
    },
  })

  return {
    aqi: response.data.current.european_aqi,
    pm10: response.data.current.pm10,
    pm25: response.data.current.pm2_5,
  }
}
