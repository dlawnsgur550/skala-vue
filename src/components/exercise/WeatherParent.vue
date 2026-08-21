<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import HeatCriteria from './HeatCriteria.vue'
import WeatherCard from './WeatherCard.vue'

// 모든 반응형 데이터는 부모 컴포넌트가 관리한다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', icon: '☀️', humidity: 55 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', icon: '🌧️', humidity: 80 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', icon: '☁️', humidity: 65 },
  { id: 'city_04', name: '제주', temp: 23, status: '바람', icon: '🌬️', humidity: 72 },
  { id: 'city_05', name: '광주', temp: 26, status: '맑음', icon: '☀️', humidity: 70 },
  { id: 'city_06', name: '광양', temp: 24, status: '맑음', icon: '☀️', humidity: 66 },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const hotTemperature = ref(25)
const hotHumidity = ref(65)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(query))
})

const hotAndHumidCityList = computed(() => {
  return weatherList.value.filter((city) => {
    return city.temp >= hotTemperature.value && city.humidity >= hotHumidity.value
  })
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`상태 바 문구가 업데이트되었습니다 → "${newInfo}"`)
})

watch([hotTemperature, hotHumidity], ([newTemp, newHumidity], [oldTemp, oldHumidity]) => {
  selectedCityInfo.value = `더위 기준이 ${newTemp}℃, 습도 ${newHumidity}%로 변경되었습니다.`
  console.log(`더위 기준 변경: ${oldTemp}℃/${oldHumidity}% → ${newTemp}℃/${newHumidity}%`)
})

watchEffect(() => {
  console.log(`현재 검색어 '${searchQuery.value}'에 매칭되는 날씨 데이터를 필터링합니다.`)
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

const selectCity = (message) => {
  selectedCityInfo.value = message
}

const showDetail = (cityId, cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <main class="weather-page">
    <header>
      <h1>🌤️ 과제 3: 날씨 (컴포넌트)</h1>
    </header>

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
      <h2>🏙️ 지역별 날씨 현황</h2>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        :is-hot="isHotAndHumid(item)"
        @select-card="selectCity"
        @click-detail="showDetail"
      />

      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </main>
</template>

<style scoped>
.weather-page {
  width: min(720px, 100%);
  margin: 0 auto;
  padding: 24px;
  color: #24324a;
  background: #f4f8fc;
}

.weather-page h1,
.weather-page h2 {
  margin-top: 0;
}

.empty-message {
  color: #b42318;
  text-align: center;
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
