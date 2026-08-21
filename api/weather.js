import { requestOpenWeather } from './_openWeather.js'

export default {
  fetch(request) {
    return requestOpenWeather(request, 'weather')
  },
}
