<script setup>
import { computed } from 'vue'
import SurvivalMeter from './SurvivalMeter.vue'
import { useConfigStore } from '../../stores/configStore'
import { usePreferenceStore } from '../../stores/preferenceStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  city: {
    type: Object,
    default: null,
  },
  forecastList: {
    type: Array,
    default: () => [],
  },
  airQuality: {
    type: Object,
    default: null,
  },
  airQualityError: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  cityName: {
    type: String,
    default: '',
  },
  statusText: {
    type: String,
    default: '',
  },
  labels: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'retry'])
const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()

const koreanLabels = {
  drawerTitle: '도시 생존 인벤토리',
  close: '상세창 닫기',
  loading: '기상 데이터를 불러오는 중...',
  loadError: '날씨 데이터를 불러오지 못했습니다.',
  retry: '다시 시도',
  noData: '표시할 도시 데이터가 없습니다.',
  currentWeather: '현재 상태',
  temperature: '기온',
  weatherStatus: '날씨',
  humidity: '습도',
  wind: '풍속',
  precipitation: '강수량',
  forecast: '5일 예보',
  noForecast: '예보 데이터가 없습니다.',
  airQuality: '대기질 장비',
  europeanAqi: '유럽 AQI',
  aqiUnavailable: 'AQI 데이터 없음',
  pm10: 'PM10',
  pm25: 'PM2.5',
  itemTemperature: '온도계',
  itemHumidity: '물방울',
  itemWind: '바람개비',
  itemRain: '빗물통',
  airSource: '대기질: Open-Meteo / CAMS ENSEMBLE',
  weatherSource: '날씨: OpenWeather',
  degrees: '도',
}

const labelAliases = {
  drawerTitle: ['detailTitle'],
  loading: ['loadingDetail'],
  loadError: ['detailLoadError'],
  retry: ['refreshWeather'],
  noData: ['noDetailData'],
  currentWeather: ['selectedRegion'],
  temperature: ['realtimeTemp'],
  weatherStatus: ['weatherStatus'],
  humidity: ['airHumidity', 'humidity'],
  wind: ['windSpeed'],
  forecast: ['forecastTitle'],
  airQuality: ['airQualityTitle'],
  europeanAqi: ['europeanAqi'],
}

const text = (key) => {
  if (props.labels[key]) return props.labels[key]
  const alias = labelAliases[key]?.find((candidate) => props.labels[candidate])
  return alias ? props.labels[alias] : koreanLabels[key]
}

const drawerVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const inventoryTitle = computed(() => {
  const name = props.cityName || props.city?.name
  return name ? `${name} · ${text('drawerTitle')}` : text('drawerTitle')
})

const convertTemperature = (temperature) => {
  const value = Number(temperature)
  if (!Number.isFinite(value)) return '-'
  if (configStore.unit === 'fahrenheit') return Math.round((value * 9) / 5 + 32)
  return Math.round(value)
}

const displayTemperature = computed(() => convertTemperature(props.city?.temp))

const formatForecastDate = (date) => {
  const [, month, day] = String(date).split('-')
  if (!month || !day) return date
  return `${Number(month)}/${Number(day)}`
}

const displayWind = computed(() => {
  if (props.city?.wind) return props.city.wind
  const windSpeed = Number(props.city?.windSpeed)
  return Number.isFinite(windSpeed) ? `${windSpeed}m/s` : '-'
})

const displayPrecipitation = computed(() => {
  const value =
    props.city?.precipitation ??
    props.city?.precipitationMm ??
    props.city?.rain1h ??
    props.city?.rain?.['1h'] ??
    props.city?.snow?.['1h'] ??
    0
  const precipitation = Number(value)
  return Number.isFinite(precipitation) ? `${precipitation}mm/h` : '-'
})

const aqiLevel = computed(() => {
  const rawAqi = props.airQuality?.aqi
  if (rawAqi === null || rawAqi === undefined || rawAqi === '') return ''
  const aqi = Number(rawAqi)
  if (!Number.isFinite(aqi)) return ''
  if (aqi <= 20) return props.labels.airQualityLevels?.good || '좋음'
  if (aqi <= 40) return props.labels.airQualityLevels?.fair || '양호'
  if (aqi <= 60) return props.labels.airQualityLevels?.moderate || '보통'
  if (aqi <= 80) return props.labels.airQualityLevels?.poor || '나쁨'
  if (aqi <= 100) return props.labels.airQualityLevels?.veryPoor || '매우 나쁨'
  return props.labels.airQualityLevels?.extremelyPoor || '매우 위험'
})

const closeDrawer = () => emit('update:modelValue', false)
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    direction="rtl"
    size="560px"
    :show-close="false"
    :class="['inventory-drawer', { 'is-dark': preferenceStore.isDark }]"
    :title="inventoryTitle"
  >
    <template #header>
      <div class="drawer-pixel-header">
        <span class="drawer-icon" aria-hidden="true">🎒</span>
        <div>
          <small>WEATHER QUEST</small>
          <h2>{{ inventoryTitle }}</h2>
        </div>
        <el-button class="pixel-close" :aria-label="text('close')" @click="closeDrawer">
          ×
        </el-button>
      </div>
    </template>

    <div class="inventory-body">
      <div v-if="loading" class="drawer-state" role="status">
        <span class="loading-sprite" aria-hidden="true">⌛</span>
        <p>{{ text('loading') }}</p>
      </div>

      <div v-else-if="error" class="drawer-state error-state" role="alert">
        <span aria-hidden="true">⚠</span>
        <p>{{ text('loadError') }}</p>
        <el-button type="danger" class="pixel-button" @click="emit('retry')">
          {{ text('retry') }}
        </el-button>
      </div>

      <template v-else-if="city">
        <el-card shadow="never" class="inventory-card current-card">
          <template #header>
            <div class="card-title">
              <span aria-hidden="true">{{ city.icon || '🌤️' }}</span>
              <strong>{{ text('currentWeather') }}</strong>
              <span class="city-chip">{{ cityName || city.name }}</span>
            </div>
          </template>

          <div class="hero-status">
            <span class="weather-sprite" aria-hidden="true">{{ city.icon || '🌤️' }}</span>
            <div>
              <strong>{{ displayTemperature }}{{ configStore.unitSymbol }}</strong>
              <span>{{ statusText || city.status }}</span>
            </div>
          </div>

          <dl class="item-slot-grid">
            <div class="item-slot">
              <dt>🌡️ {{ text('itemTemperature') }}</dt>
              <dd>{{ displayTemperature }}{{ configStore.unitSymbol }}</dd>
            </div>
            <div class="item-slot">
              <dt>💧 {{ text('itemHumidity') }}</dt>
              <dd>{{ city.humidity }}%</dd>
            </div>
            <div class="item-slot">
              <dt>🍃 {{ text('itemWind') }}</dt>
              <dd>{{ displayWind }}</dd>
            </div>
            <div class="item-slot">
              <dt>🌧️ {{ text('itemRain') }}</dt>
              <dd>{{ displayPrecipitation }}</dd>
            </div>
          </dl>
        </el-card>

        <SurvivalMeter :current-weather="city" :air-quality="airQuality" :labels="labels" />

        <el-card shadow="never" class="inventory-card">
          <template #header>
            <div class="card-title">
              <span aria-hidden="true">📅</span>
              <strong>{{ text('forecast') }}</strong>
            </div>
          </template>

          <div v-if="forecastList.length" class="forecast-slots" role="list">
            <article
              v-for="forecast in forecastList"
              :key="forecast.date"
              class="forecast-slot"
              role="listitem"
            >
              <time :datetime="forecast.date" :title="forecast.date">
                {{ formatForecastDate(forecast.date) }}
              </time>
              <span class="forecast-icon" aria-hidden="true">{{ forecast.icon }}</span>
              <strong>{{ convertTemperature(forecast.temp) }}{{ configStore.unitSymbol }}</strong>
              <small>{{ text('humidity') }} {{ forecast.humidity }}%</small>
            </article>
          </div>
          <p v-else class="empty-slot">{{ text('noForecast') }}</p>
        </el-card>

        <el-card shadow="never" class="inventory-card air-card">
          <template #header>
            <div class="card-title">
              <span aria-hidden="true">🫁</span>
              <strong>{{ text('airQuality') }}</strong>
            </div>
          </template>

          <div v-if="airQuality && !airQualityError" class="air-slot-grid">
            <div class="air-slot main-aqi">
              <span>{{ text('europeanAqi') }}</span>
              <strong>{{ airQuality.aqi ?? '-' }}</strong>
              <small>{{ aqiLevel }}</small>
            </div>
            <div class="air-slot">
              <span>{{ text('pm10') }}</span>
              <strong>{{ airQuality.pm10 ?? '-' }}</strong>
              <small>㎍/㎥</small>
            </div>
            <div class="air-slot">
              <span>{{ text('pm25') }}</span>
              <strong>{{ airQuality.pm25 ?? '-' }}</strong>
              <small>㎍/㎥</small>
            </div>
          </div>
          <p v-else class="empty-slot warning-slot">{{ text('aqiUnavailable') }}</p>
        </el-card>

        <p class="source-note">
          {{ text('weatherSource') }}<br />
          {{ text('airSource') }}
        </p>
      </template>

      <div v-else class="drawer-state">
        <span aria-hidden="true">🗺️</span>
        <p>{{ text('noData') }}</p>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
:global(.inventory-drawer) {
  --inventory-canvas: #d8c08d;
  --inventory-panel: #e6d5aa;
  --inventory-slot: #c4aa76;
  --inventory-slot-dark: #8d784f;
  --inventory-border: #574a34;
  --inventory-highlight: #fff1c8;
  --inventory-shadow: #9d855b;
  --inventory-text: #2d321f;
  --inventory-muted: #665e4d;
  --inventory-warning: #f4c768;
  --el-color-primary: #4b852d;
  width: min(560px, 96vw) !important;
  color: var(--inventory-text);
  background: var(--inventory-canvas);
  border-left: 5px solid #29241c;
  box-shadow: -8px 0 0 rgba(25, 23, 18, 0.45);
  font-family: 'Galmuri11', 'DungGeunMo', monospace;
}

:global(.inventory-drawer.is-dark) {
  --inventory-canvas: #252b27;
  --inventory-panel: #343b34;
  --inventory-slot: #454d42;
  --inventory-slot-dark: #20251f;
  --inventory-border: #111511;
  --inventory-highlight: #697466;
  --inventory-shadow: #222820;
  --inventory-text: #edf3d4;
  --inventory-muted: #c1c9ae;
  --inventory-warning: #72562d;
}

:global(.inventory-drawer .el-drawer__header) {
  padding: 0;
  margin: 0;
  color: var(--inventory-text);
}

:global(.inventory-drawer .el-drawer__body) {
  padding: 12px;
}

.drawer-pixel-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 12px;
  color: var(--inventory-text);
  background: var(--inventory-panel);
  border-bottom: 4px solid var(--inventory-border);
  box-shadow: inset 0 -3px 0 var(--inventory-shadow);
}

.drawer-icon {
  font-size: 2rem;
}

.drawer-pixel-header small {
  color: var(--inventory-muted);
  letter-spacing: 0.12em;
}

.drawer-pixel-header h2 {
  margin: 4px 0 0;
  color: var(--inventory-text);
  font-size: 1.05rem;
}

.pixel-close,
.pixel-button {
  min-width: 38px;
  color: #ffffff;
  background: #70563b;
  border: 3px solid #30271d;
  border-radius: 0;
  box-shadow: 3px 3px 0 #30271d;
  font-family: inherit;
}

.pixel-close:hover,
.pixel-button:hover,
.pixel-close:focus-visible,
.pixel-button:focus-visible {
  color: #ffffff;
  background: #4f7f31;
  border-color: #202919;
}

.inventory-body {
  display: grid;
  gap: 12px;
}

.drawer-state {
  display: grid;
  min-height: 260px;
  place-items: center;
  align-content: center;
  gap: 12px;
  padding: 20px;
  color: var(--inventory-text);
  text-align: center;
  background: var(--inventory-panel);
  border: 4px solid var(--inventory-border);
  box-shadow:
    inset 3px 3px 0 var(--inventory-highlight),
    inset -3px -3px 0 var(--inventory-shadow);
}

.drawer-state > span {
  font-size: 2.5rem;
}

.error-state {
  color: #942b27;
}

.loading-sprite {
  animation: pixel-wait 1s steps(4, end) infinite;
}

.inventory-card {
  color: var(--inventory-text);
  background: var(--inventory-panel);
  border: 4px solid var(--inventory-border);
  border-radius: 0;
  box-shadow:
    inset 3px 3px 0 var(--inventory-highlight),
    inset -3px -3px 0 var(--inventory-shadow);
}

:deep(.inventory-card .el-card__header) {
  padding: 10px 12px;
  border-bottom: 3px solid var(--inventory-border);
}

:deep(.inventory-card .el-card__body) {
  padding: 12px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.city-chip {
  margin-left: auto;
  padding: 3px 6px;
  background: var(--inventory-slot);
  border: 2px solid var(--inventory-border);
  font-size: 0.72rem;
}

.hero-status {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
  padding: 10px;
  background: var(--inventory-slot-dark);
  border: 3px solid var(--inventory-border);
  color: var(--inventory-text);
}

.weather-sprite {
  font-size: 2.5rem;
}

.hero-status div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-status strong {
  font-size: 1.4rem;
}

.item-slot-grid,
.air-slot-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  margin: 0;
}

.item-slot,
.air-slot,
.forecast-slot {
  min-width: 0;
  padding: 8px;
  text-align: center;
  background: var(--inventory-slot);
  border: 3px solid var(--inventory-border);
  box-shadow:
    inset 2px 2px 0 var(--inventory-shadow),
    inset -2px -2px 0 var(--inventory-highlight);
}

.item-slot dt,
.item-slot dd {
  margin: 0;
}

.item-slot dt {
  min-height: 32px;
  color: var(--inventory-muted);
  font-size: 0.68rem;
}

.item-slot dd {
  margin-top: 5px;
  overflow-wrap: anywhere;
  font-weight: 700;
}

.forecast-slots {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 5px;
}

.forecast-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
}

.forecast-slot time {
  font-size: 0.66rem;
  white-space: nowrap;
}

.forecast-slot small {
  font-size: 0.64rem;
  white-space: nowrap;
}

.forecast-icon {
  font-size: 1.4rem;
}

.air-slot-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.air-slot {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.air-slot strong {
  font-size: 1.3rem;
}

.main-aqi {
  background: #b7bd74;
}

:global(.inventory-drawer.is-dark) .main-aqi {
  background: #435537;
}

.empty-slot {
  margin: 0;
  padding: 14px;
  text-align: center;
  background: var(--inventory-slot);
  border: 3px dashed var(--inventory-border);
}

.warning-slot {
  color: #8f2f28;
  background: var(--inventory-warning);
}

.source-note {
  margin: 0;
  color: var(--inventory-muted);
  font-size: 0.68rem;
  line-height: 1.7;
  text-align: center;
}

@keyframes pixel-wait {
  50% {
    transform: translateY(-5px);
  }
}

@media (max-width: 560px) {
  :global(.inventory-drawer) {
    width: 100vw !important;
  }

  .drawer-pixel-header h2 {
    font-size: 0.9rem;
  }

  .item-slot-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .forecast-slots {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-sprite {
    animation: none;
  }
}
</style>
