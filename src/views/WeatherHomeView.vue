<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import HeatCriteria from '../components/exercise/HeatCriteria.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { weatherCities } from '../data/weatherData'
import { fetchCurrentWeather } from '../services/weatherApi'
import { useConfigStore } from '../stores/configStore'
import { usePreferenceStore } from '../stores/preferenceStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()

const weatherList = ref([])
const isWeatherLoading = ref(false)
const hasWeatherError = ref(false)
const lastUpdated = ref('')
const searchQuery = ref('')
const selectedCityId = ref('')
const statusMode = ref('initial')
const hotTemperature = ref(25)
const hotHumidity = ref(65)

const loadWeather = async () => {
  if (isWeatherLoading.value) return

  isWeatherLoading.value = true
  hasWeatherError.value = false

  try {
    const liveWeatherList = []

    for (const city of weatherCities) {
      const cityWeather = await fetchCurrentWeather(city)
      liveWeatherList.push(cityWeather)
    }

    weatherList.value = liveWeatherList
    lastUpdated.value = new Date().toLocaleTimeString()
  } catch {
    hasWeatherError.value = true
  } finally {
    isWeatherLoading.value = false
  }
}

onMounted(() => {
  if (typeof route.query.search === 'string') {
    searchQuery.value = route.query.search
  }

  loadWeather()
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return weatherList.value

  return weatherList.value.filter((city) => {
    const cityName = preferenceStore.texts.cityNames[city.id].toLowerCase()
    return cityName.includes(query)
  })
})

const hotAndHumidCityList = computed(() => {
  return weatherList.value.filter((city) => {
    return city.temp >= hotTemperature.value && city.humidity >= hotHumidity.value
  })
})

const displayHotTemperature = computed(() => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((hotTemperature.value * 9) / 5 + 32)
  }
  return hotTemperature.value
})

const statusMessage = computed(() => {
  if (statusMode.value === 'selected') {
    return `${preferenceStore.texts.cityNames[selectedCityId.value]} ${preferenceStore.texts.selectedSuffix}`
  }

  if (statusMode.value === 'criteria') {
    return `${preferenceStore.texts.criteriaChanged} (${displayHotTemperature.value}${configStore.unitSymbol}, ${hotHumidity.value}%)`
  }

  return preferenceStore.texts.initialStatus
})

watch(searchQuery, (newQuery) => {
  router.push({
    name: 'WeatherHome',
    query: newQuery ? { search: newQuery } : {},
  })
})

watch(selectedCityId, (newCityId) => {
  if (newCityId) {
    console.log(`선택된 도시 ID: ${newCityId}`)
  }
})

watch([hotTemperature, hotHumidity], ([newTemp, newHumidity], [oldTemp, oldHumidity]) => {
  statusMode.value = 'criteria'
  console.log(`더위 기준 변경: ${oldTemp}℃/${oldHumidity}% → ${newTemp}℃/${newHumidity}%`)
})

watchEffect(() => {
  console.log(`현재 검색어 '${searchQuery.value}'에 맞는 날씨 데이터를 필터링합니다.`)
})

const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery
}

const updateHotTemperature = (newTemperature) => {
  hotTemperature.value = newTemperature
}

const updateHotHumidity = (newHumidity) => {
  hotHumidity.value = newHumidity
}

const isHotAndHumid = (city) => {
  return city.temp >= hotTemperature.value && city.humidity >= hotHumidity.value
}

const selectCity = (cityId) => {
  selectedCityId.value = cityId
  statusMode.value = 'selected'
}

const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <HeatCriteria
        :hot-temperature="hotTemperature"
        :hot-humidity="hotHumidity"
        :hot-cities="hotAndHumidCityList"
        @update-temperature="updateHotTemperature"
        @update-humidity="updateHotHumidity"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="weather-heading">
        <div>
          <h2>{{ preferenceStore.texts.weatherListTitle }}</h2>
          <p class="api-label">{{ preferenceStore.texts.liveWeather }}</p>
        </div>
        <button class="refresh-button" :disabled="isWeatherLoading" @click="loadWeather">
          {{ preferenceStore.texts.refreshWeather }}
        </button>
      </div>

      <p v-if="lastUpdated" class="updated-time">
        {{ preferenceStore.texts.lastUpdated }}: {{ lastUpdated }}
      </p>
      <p v-if="isWeatherLoading" class="loading-message">
        {{ preferenceStore.texts.loadingWeather }}
      </p>
      <p v-else-if="hasWeatherError" class="error-message">
        {{ preferenceStore.texts.weatherLoadError }}
      </p>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        :is-hot="isHotAndHumid(item)"
        @select-card="selectCity"
        @click-detail="goToDetail"
      />

      <p
        v-if="!isWeatherLoading && !hasWeatherError && filteredWeatherList.length === 0"
        class="empty-message"
      >
        {{ preferenceStore.texts.noSearchResult }}
      </p>
    </BaseDashboardCard>

    <p class="status-bar">{{ statusMessage }}</p>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  color: #24324a;
}

.dashboard-wrapper h2 {
  margin: 0;
}

.weather-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.api-label,
.updated-time {
  margin: 4px 0;
  color: #64748b;
  font-size: 0.9rem;
}

.refresh-button {
  padding: 8px 12px;
  color: #ffffff;
  background: #1683bd;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.loading-message,
.error-message,
.empty-message {
  padding: 16px;
  text-align: center;
}

.error-message,
.empty-message {
  color: #b42318;
}

.status-bar {
  margin: 16px 0 0;
  padding: 12px;
  color: #155b32;
  background: #dff3e5;
  border: 1px solid #86c79d;
  text-align: center;
  font-weight: bold;
}
</style>
