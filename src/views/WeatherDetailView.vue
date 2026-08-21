<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { weatherCities } from '../data/weatherData'
import {
  fetchAirQuality,
  fetchCurrentWeather,
  fetchFiveDayForecast,
} from '../services/weatherApi'
import { useConfigStore } from '../stores/configStore'
import { usePreferenceStore } from '../stores/preferenceStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()

const selectedCity = weatherCities.find((city) => city.id === route.params.cityId)
const cityData = ref(null)
const forecastList = ref([])
const airQuality = ref(null)
const isLoading = ref(false)
const hasLoadError = ref(false)

const loadDetail = async () => {
  if (!selectedCity) return

  isLoading.value = true
  hasLoadError.value = false

  try {
    cityData.value = await fetchCurrentWeather(selectedCity)
    forecastList.value = await fetchFiveDayForecast(selectedCity)
    airQuality.value = await fetchAirQuality(selectedCity)
  } catch {
    hasLoadError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(loadDetail)

const cityName = computed(() => {
  return preferenceStore.texts.regionNames[route.params.cityId]
})

const statusText = computed(() => {
  if (!cityData.value) return ''
  return preferenceStore.texts.statuses[cityData.value.status]
})

const convertTemperature = (temperature) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temperature * 9) / 5 + 32)
  }
  return temperature
}

const displayTemp = computed(() => {
  if (!cityData.value) return ''
  return convertTemperature(cityData.value.temp)
})

const airQualityLevel = computed(() => {
  if (!airQuality.value) return ''

  const aqi = airQuality.value.aqi
  if (aqi <= 20) return preferenceStore.texts.airQualityLevels.good
  if (aqi <= 40) return preferenceStore.texts.airQualityLevels.fair
  if (aqi <= 60) return preferenceStore.texts.airQualityLevels.moderate
  if (aqi <= 80) return preferenceStore.texts.airQualityLevels.poor
  if (aqi <= 100) return preferenceStore.texts.airQualityLevels.veryPoor
  return preferenceStore.texts.airQualityLevels.extremelyPoor
})

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <section class="detail-container">
    <h2>{{ preferenceStore.texts.detailTitle }}</h2>

    <p v-if="isLoading" class="loading-message">
      {{ preferenceStore.texts.loadingDetail }}
    </p>

    <div v-else-if="hasLoadError" class="missing-data">
      <p>{{ preferenceStore.texts.detailLoadError }}</p>
      <button class="retry-button" @click="loadDetail">
        {{ preferenceStore.texts.refreshWeather }}
      </button>
    </div>

    <template v-else-if="cityData">
      <div class="info-card">
        <h3>📍 {{ preferenceStore.texts.selectedRegion }}: {{ cityName }}</h3>
        <p>{{ preferenceStore.texts.realtimeTemp }}: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <p>{{ preferenceStore.texts.weatherStatus }}: {{ statusText }}</p>
        <p>{{ preferenceStore.texts.airHumidity }}: {{ cityData.humidity }}%</p>
        <p>{{ preferenceStore.texts.windSpeed }}: {{ cityData.wind }}</p>
      </div>

      <section class="detail-section">
        <h3>{{ preferenceStore.texts.forecastTitle }}</h3>
        <div class="forecast-grid">
          <article v-for="forecast in forecastList" :key="forecast.date" class="forecast-card">
            <strong>{{ forecast.date }}</strong>
            <span class="forecast-icon">{{ forecast.icon }}</span>
            <span>{{ convertTemperature(forecast.temp) }}{{ configStore.unitSymbol }}</span>
            <span>{{ preferenceStore.texts.humidity }} {{ forecast.humidity }}%</span>
          </article>
        </div>
      </section>

      <section v-if="airQuality" class="detail-section air-quality-card">
        <h3>{{ preferenceStore.texts.airQualityTitle }}</h3>
        <p>
          {{ preferenceStore.texts.europeanAqi }}: <strong>{{ airQuality.aqi }}</strong>
          ({{ airQualityLevel }})
        </p>
        <p>PM10: {{ airQuality.pm10 }}㎍/㎥</p>
        <p>PM2.5: {{ airQuality.pm25 }}㎍/㎥</p>
      </section>
    </template>

    <div v-else class="missing-data">
      <p>{{ preferenceStore.texts.noDetailData }}</p>
    </div>

    <button class="back-button" @click="goHome">{{ preferenceStore.texts.backDashboard }}</button>
  </section>
</template>

<style scoped>
.detail-container {
  padding: 20px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.detail-container h2 {
  margin-top: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #cbd5e1;
}

.info-card,
.missing-data,
.detail-section {
  margin: 16px 0;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 6px;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
  gap: 10px;
}

.forecast-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

.forecast-icon {
  font-size: 1.6rem;
}

.air-quality-card {
  border-left: 5px solid #27a567;
}

.loading-message {
  padding: 28px;
  text-align: center;
}

.back-button,
.retry-button {
  padding: 9px 13px;
  color: #ffffff;
  background: #2c3e50;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}
</style>
