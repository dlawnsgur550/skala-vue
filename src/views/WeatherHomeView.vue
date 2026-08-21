<script setup>
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CityInventoryDrawer from '../components/game/CityInventoryDrawer.vue'
import GamePanel from '../components/game/GamePanel.vue'
import GameSettings from '../components/game/GameSettings.vue'
import WeatherGameMap from '../components/game/WeatherGameMap.vue'
import { weatherCities } from '../data/weatherData'
import { fetchAirQuality, fetchCurrentWeather, fetchFiveDayForecast } from '../services/weatherApi'
import { usePreferenceStore } from '../stores/preferenceStore'

const route = useRoute()
const router = useRouter()
const preferenceStore = usePreferenceStore()

const currentWeatherById = reactive({})
const detailCache = reactive({})
const isWeatherLoading = ref(false)
const hasWeatherError = ref(false)
const lastUpdated = ref(null)

const weatherList = computed(() => {
  return weatherCities.map((city) => {
    const weather = currentWeatherById[city.id] ?? city
    return {
      ...weather,
      statusText: weather.status ? preferenceStore.texts.statuses[weather.status] : '',
    }
  })
})

const displayLastUpdated = computed(() => {
  if (!lastUpdated.value) return ''
  const localeByLanguage = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' }
  return lastUpdated.value.toLocaleTimeString(localeByLanguage[preferenceStore.language])
})

const routeCityId = computed(() => {
  return typeof route.params.cityId === 'string' ? route.params.cityId : ''
})

const selectedCity = computed(() => {
  return weatherCities.find((city) => city.id === routeCityId.value) ?? null
})

const selectedWeather = computed(() => {
  if (!selectedCity.value) return null
  return currentWeatherById[selectedCity.value.id] ?? null
})

const selectedDetail = computed(() => {
  return (
    detailCache[routeCityId.value] ?? {
      forecastList: [],
      airQuality: null,
      loading: false,
      detailError: false,
      airQualityError: false,
    }
  )
})

const selectedCityName = computed(() => {
  if (!selectedCity.value) return ''
  return preferenceStore.texts.cityNames[selectedCity.value.id]
})

const selectedStatusText = computed(() => {
  if (!selectedWeather.value) return ''
  return preferenceStore.texts.statuses[selectedWeather.value.status]
})

const drawerLabels = computed(() => {
  return {
    ...preferenceStore.texts,
    ...preferenceStore.texts.game,
    temperature: preferenceStore.texts.currentTemp,
    humidity: preferenceStore.texts.humidity,
    wind: preferenceStore.texts.windSpeed,
    aqi: preferenceStore.texts.europeanAqi,
    loading: preferenceStore.texts.loadingDetail,
    loadError: preferenceStore.texts.detailLoadError,
  }
})

const settingsLabels = computed(() => {
  const game = preferenceStore.texts.game
  return {
    title: game.settingsTitle,
    theme: game.appearance,
    unit: game.unit,
    language: game.language,
    city: game.city,
    cityPlaceholder: game.selectCity,
    refresh: game.refresh,
  }
})

const drawerVisible = computed({
  get() {
    return Boolean(selectedCity.value)
  },
  set(isOpen) {
    if (!isOpen && routeCityId.value) {
      router.push({ name: 'WeatherHome' })
    }
  },
})

const statusMessage = computed(() => {
  if (selectedCity.value) {
    return `${selectedCityName.value} · ${preferenceStore.texts.game.statusSelected}`
  }
  if (hasWeatherError.value) return preferenceStore.texts.weatherLoadError
  return preferenceStore.texts.game.statusReady
})

const loadWeather = async () => {
  if (isWeatherLoading.value) return

  isWeatherLoading.value = true
  hasWeatherError.value = false

  const results = await Promise.allSettled(weatherCities.map((city) => fetchCurrentWeather(city)))
  let successCount = 0

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      currentWeatherById[weatherCities[index].id] = result.value
      successCount += 1
    }
  })

  hasWeatherError.value = successCount === 0
  if (successCount > 0) lastUpdated.value = new Date()
  isWeatherLoading.value = false
}

const loadCityDetail = async (cityId, force = false) => {
  const city = weatherCities.find((item) => item.id === cityId)
  if (!city) return

  const saved = detailCache[cityId]
  if (!force && saved && !saved.loading && saved.loaded) return

  detailCache[cityId] = {
    forecastList: saved?.forecastList ?? [],
    airQuality: saved?.airQuality ?? null,
    loading: true,
    loaded: false,
    detailError: false,
    airQualityError: false,
  }

  const currentRequest = currentWeatherById[cityId]
    ? Promise.resolve(currentWeatherById[cityId])
    : fetchCurrentWeather(city)

  const [currentResult, forecastResult, airResult] = await Promise.allSettled([
    currentRequest,
    fetchFiveDayForecast(city),
    fetchAirQuality(city),
  ])

  if (currentResult.status === 'fulfilled') {
    currentWeatherById[cityId] = currentResult.value
  }

  detailCache[cityId] = {
    forecastList: forecastResult.status === 'fulfilled' ? forecastResult.value : [],
    airQuality: airResult.status === 'fulfilled' ? airResult.value : null,
    loading: false,
    loaded: true,
    detailError: currentResult.status === 'rejected' || forecastResult.status === 'rejected',
    airQualityError:
      airResult.status === 'rejected' ||
      airResult.value?.aqi === null ||
      airResult.value?.aqi === undefined,
  }
}

const selectCity = (cityId) => {
  if (!weatherCities.some((city) => city.id === cityId)) return

  if (routeCityId.value === cityId) {
    loadCityDetail(cityId)
    return
  }

  router.push({ name: 'WeatherDetail', params: { cityId } })
}

const refreshAll = async () => {
  await loadWeather()
  if (selectedCity.value) await loadCityDetail(selectedCity.value.id, true)
}

watch(
  routeCityId,
  (cityId) => {
    if (!cityId) return
    if (!weatherCities.some((city) => city.id === cityId)) {
      router.replace('/unknown-city')
      return
    }
    loadCityDetail(cityId)
  },
  { immediate: true },
)

watchEffect(() => {
  const pageName = selectedCityName.value || preferenceStore.texts.game.mapTitle
  document.title = `${pageName} | ${preferenceStore.texts.game.title}`
})

onMounted(loadWeather)
</script>

<template>
  <section class="weather-game-view" aria-labelledby="game-map-title">
    <div class="mission-banner">
      <span class="mission-led" aria-hidden="true"></span>
      <div>
        <strong>MISSION 01</strong>
        <span>{{ preferenceStore.texts.game.mapHint }}</span>
      </div>
      <time v-if="lastUpdated">
        {{ preferenceStore.texts.lastUpdated }} {{ displayLastUpdated }}
      </time>
    </div>

    <GameSettings
      :cities="weatherList"
      :selected-city-id="routeCityId"
      :loading="isWeatherLoading"
      :labels="settingsLabels"
      @select-city="selectCity"
      @refresh="refreshAll"
    />

    <GamePanel class="map-console">
      <template #header>
        <div class="map-panel-heading">
          <div>
            <span class="panel-kicker">LIVE SECTOR / KR</span>
            <h2 id="game-map-title">{{ preferenceStore.texts.game.mapTitle }}</h2>
          </div>
          <span :class="['signal-chip', { warning: hasWeatherError }]">
            {{ hasWeatherError ? 'SIGNAL LOST' : 'ONLINE' }}
          </span>
        </div>
      </template>

      <WeatherGameMap
        :weather-list="weatherList"
        :selected-city-id="routeCityId"
        :city-names="preferenceStore.texts.cityNames"
        :labels="preferenceStore.texts.game"
        :loading="isWeatherLoading"
        @select-city="selectCity"
      />

      <template #footer>
        <div class="map-status" role="status">
          <span class="status-cursor" aria-hidden="true">▶</span>
          <span>{{ statusMessage }}</span>
        </div>
      </template>
    </GamePanel>

    <p v-if="hasWeatherError" class="global-error">
      {{ preferenceStore.texts.weatherLoadError }}
    </p>

    <CityInventoryDrawer
      v-model="drawerVisible"
      :city="selectedWeather"
      :forecast-list="selectedDetail.forecastList"
      :air-quality="selectedDetail.airQuality"
      :air-quality-error="selectedDetail.airQualityError"
      :loading="selectedDetail.loading"
      :error="selectedDetail.detailError"
      :city-name="selectedCityName"
      :status-text="selectedStatusText"
      :labels="drawerLabels"
      @retry="loadCityDetail(routeCityId, true)"
    />
  </section>
</template>

<style scoped>
.weather-game-view {
  display: grid;
  gap: 14px;
}

.mission-banner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 8px 14px;
  color: var(--pixel-ink);
  background: var(--pixel-panel-deep);
  border: var(--pixel-border);
  box-shadow: var(--pixel-shadow-small);
}

.mission-banner div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
}

.mission-banner strong {
  color: var(--pixel-accent);
}

.mission-banner time {
  color: var(--pixel-muted);
  font-size: 0.75rem;
}

.mission-led {
  width: 10px;
  height: 10px;
  background: #7ef29a;
  box-shadow:
    0 0 0 3px #1f5d37,
    0 0 12px #7ef29a;
}

.map-panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.map-panel-heading h2 {
  margin: 2px 0 0;
  color: var(--pixel-ink-strong);
  font-size: clamp(1rem, 2vw, 1.35rem);
}

.panel-kicker {
  color: var(--pixel-accent);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
}

.signal-chip {
  padding: 4px 8px;
  color: #0c2c1a;
  background: #7ef29a;
  border: 2px solid #1f5d37;
  font-size: 0.7rem;
}

.signal-chip.warning {
  color: #3d140e;
  background: #ff896f;
  border-color: #8c2d22;
}

.map-status {
  display: flex;
  align-items: center;
  min-height: 26px;
  gap: 8px;
  color: var(--pixel-muted);
  font-size: 0.8rem;
}

.status-cursor {
  color: var(--pixel-accent);
}

.global-error {
  margin: 0;
  padding: 12px;
  color: #ffd5cc;
  background: #5c201b;
  border: 3px solid #a84032;
  text-align: center;
}

@media (max-width: 720px) {
  .mission-banner {
    grid-template-columns: auto 1fr;
  }

  .mission-banner time {
    grid-column: 2;
  }
}
</style>
