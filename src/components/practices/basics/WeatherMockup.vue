<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

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

// 도시 검색어를 기준으로 날씨 목록을 필터링
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(query))
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`상태 바 문구가 업데이트되었습니다 → "${newInfo}"`)
})

watchEffect(() => {
  console.log(`현재 검색어 '${searchQuery.value}'에 매칭되는 날씨 데이터를 필터링합니다.`)
})

// 본인만의 반응형 상태 변수
const hotTemperature = ref(25)
const hotHumidity = ref(65)

// 본인만의 Computed
const hotAndHumidCityList = computed(() => {
  return weatherList.value.filter((city) => {
    return city.temp >= hotTemperature.value && city.humidity >= hotHumidity.value
  })
})

// 본인만의 Watcher
watch([hotTemperature, hotHumidity], ([newTemp, newHumidity], [oldTemp, oldHumidity]) => {
  selectedCityInfo.value = `더위 기준이 ${newTemp}℃, 습도 ${newHumidity}%로 변경되었습니다.`
  console.log(`더위 기준 변경: ${oldTemp}℃/${oldHumidity}% → ${newTemp}℃/${newHumidity}%`)
})

const handleSearch = (event) => {
  searchQuery.value = event.target.value
}

const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <main class="weather-page">
    <header>
      <h1>지역별 날씨 Mockup</h1>
    </header>

    <section class="search-section">
      <label for="city-search">🔍 도시 검색<br /></label>
      <input
        id="city-search"
        type="text"
        :value="searchQuery"
        @input="handleSearch"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시:
        <strong>{{ searchQuery || '입력 전' }}</strong>
      </p>
    </section>

    <section class="standard-section">
      <h2>🌡️ 나의 더위 기준</h2>

      <label for="hot-temperature">기온 기준</label>
      <input id="hot-temperature" type="number" v-model.number="hotTemperature" /> ℃

      <label for="hot-humidity">습도 기준</label>
      <input id="hot-humidity" type="number" v-model.number="hotHumidity" /> %

      <p>
        {{ hotTemperature }}℃ 이상이면서 습도 {{ hotHumidity }}% 이상인 도시:
        <strong>{{ hotAndHumidCityList.length }}개</strong>
      </p>

      <ul v-if="hotAndHumidCityList.length > 0">
        <li v-for="city in hotAndHumidCityList" :key="city.id">
          {{ city.name }} - {{ city.temp }}℃ / 습도 {{ city.humidity }}%
        </li>
      </ul>

      <p v-else>현재 기준에 해당하는 도시가 없습니다.</p>
    </section>

    <section class="weather-section">
      <h2>🏙️ 지역별 날씨 현황</h2>

      <article
        v-for="weather in filteredWeatherList"
        :key="weather.id"
        class="weather-card"
        @click="selectCity(weather.name)"
      >
        <div class="weather-info">
          <h3>{{ weather.icon }} {{ weather.name }} ({{ weather.status }})</h3>
          <p>현재 기온: {{ weather.temp }}℃</p>
          <p>현재 습도: {{ weather.humidity }}%</p>

          <span v-if="weather.temp >= 25" class="temperature-label hot"> 🔥 더움 (25도 이상) </span>
          <span v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</span>
        </div>

        <button class="detail-button" @click.stop="showDetail(weather.name, weather.status)">
          상세보기
        </button>
      </article>

      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </main>
</template>

<style scoped>
.weather-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
  color: #24324a;
  background: #f4f8fc;
}

.search-section,
.standard-section,
.weather-section {
  margin-top: 20px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.search-section input {
  display: block;
  width: 100%;
  margin: 8px 0;
  padding: 8px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #94a3b8;
}

.standard-section label {
  display: block;
  margin-top: 8px;
}

.weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 10px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
}

.weather-info p {
  margin: 4px 0;
}

.temperature-label {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 8px;
  color: #ffffff;
  border-radius: 4px;
}

.hot {
  background: #ff6b6b;
}

.cool {
  background: #4dabf7;
}

.detail-button {
  padding: 8px 12px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #64748b;
}

.empty-message {
  color: #c0392b;
  text-align: center;
}

.status-bar {
  margin: 20px 0 0;
  padding: 12px;
  color: #155b32;
  background: #dff3e5;
  border: 1px solid #86c79d;
  text-align: center;
  font-weight: bold;
}

@media (max-width: 600px) {
  .weather-card {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
