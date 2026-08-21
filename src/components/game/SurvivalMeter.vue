<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentWeather: {
    type: Object,
    default: null,
  },
  airQuality: {
    type: Object,
    default: null,
  },
  labels: {
    type: Object,
    default: () => ({}),
  },
})

const koreanLabels = {
  survivalTitle: '날씨 생존 난이도',
  survivalUnavailable: '계산 불가',
  survivalMissingAqi: 'AQI 데이터가 없어 잘못된 안전 판단을 막기 위해 점수를 표시하지 않습니다.',
  survivalDisclaimer: '수업용 자체 지수이며 공식 안전·의료 지수가 아닙니다.',
  gradeSafe: '안전',
  gradeCaution: '주의',
  gradeDanger: '위험',
  gradeExtreme: '극한',
  riskTemperature: '기온',
  riskHumidity: '습도',
  riskPrecipitation: '강수',
  riskWind: '풍속',
  riskAqi: 'AQI',
}

const text = (key) => props.labels[key] || koreanLabels[key]
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value))

const toFiniteNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const riskResult = computed(() => {
  const weather = props.currentWeather
  const aqi = toFiniteNumber(props.airQuality?.aqi)

  if (!weather || aqi === null) {
    return { available: false, score: 0, grade: '', color: '#7b8491', breakdown: [] }
  }

  const temperature = toFiniteNumber(weather.temp)
  const humidity = toFiniteNumber(weather.humidity)
  const windSpeed = toFiniteNumber(weather.windSpeed ?? parseFloat(weather.wind))
  const precipitation =
    toFiniteNumber(
      weather.precipitation ??
        weather.precipitationMm ??
        weather.rain1h ??
        weather.rain?.['1h'] ??
        weather.snow?.['1h'] ??
        0,
    ) ?? 0

  if (temperature === null || humidity === null || windSpeed === null) {
    return { available: false, score: 0, grade: '', color: '#7b8491', breakdown: [] }
  }

  let temperatureRisk = 0
  if (temperature > 26) temperatureRisk = Math.min(30, (temperature - 26) * 3)
  if (temperature < 10) temperatureRisk = Math.min(30, (10 - temperature) * 2)

  const humidityRisk = temperature >= 26 ? clamp((humidity - 55) * 0.5, 0, 15) : 0

  let precipitationRisk = 0
  if (precipitation > 0 && precipitation < 1) precipitationRisk = 4
  else if (precipitation >= 1 && precipitation < 4) precipitationRisk = 8
  else if (precipitation >= 4 && precipitation < 10) precipitationRisk = 14
  else if (precipitation >= 10) precipitationRisk = 20

  const windRisk = clamp((windSpeed - 4) * 1.5, 0, 15)
  const aqiRisk = clamp(aqi / 5, 0, 20)
  const score = Math.round(
    clamp(temperatureRisk + humidityRisk + precipitationRisk + windRisk + aqiRisk, 0, 100),
  )

  let grade = text('gradeSafe')
  let color = '#56a64b'
  if (score >= 75) {
    grade = text('gradeExtreme')
    color = '#a93f36'
  } else if (score >= 50) {
    grade = text('gradeDanger')
    color = '#d9633d'
  } else if (score >= 25) {
    grade = text('gradeCaution')
    color = '#d5a62f'
  }

  return {
    available: true,
    score,
    grade,
    color,
    breakdown: [
      {
        key: 'temperature',
        label: text('riskTemperature'),
        value: Math.round(temperatureRisk),
        max: 30,
      },
      { key: 'humidity', label: text('riskHumidity'), value: Math.round(humidityRisk), max: 15 },
      {
        key: 'precipitation',
        label: text('riskPrecipitation'),
        value: precipitationRisk,
        max: 20,
      },
      { key: 'wind', label: text('riskWind'), value: Math.round(windRisk), max: 15 },
      { key: 'aqi', label: text('riskAqi'), value: Math.round(aqiRisk), max: 20 },
    ],
  }
})
</script>

<template>
  <section class="survival-meter" aria-live="polite">
    <div class="meter-heading">
      <span aria-hidden="true">❤</span>
      <h3>{{ text('survivalTitle') }}</h3>
    </div>

    <template v-if="riskResult.available">
      <div class="score-row">
        <strong class="score-number">{{ riskResult.score }}</strong>
        <span class="score-total">/ 100</span>
        <span class="grade-badge" :style="{ backgroundColor: riskResult.color }">
          {{ riskResult.grade }}
        </span>
      </div>

      <el-progress
        :percentage="riskResult.score"
        :stroke-width="18"
        :color="riskResult.color"
        :text-inside="true"
        :aria-label="`${text('survivalTitle')} ${riskResult.score} / 100, ${riskResult.grade}`"
      />

      <ul class="risk-slots" :aria-label="text('survivalTitle')">
        <li v-for="risk in riskResult.breakdown" :key="risk.key" class="risk-slot">
          <span>{{ risk.label }}</span>
          <strong>{{ risk.value }}/{{ risk.max }}</strong>
        </li>
      </ul>
    </template>

    <div v-else class="unavailable-box" role="status">
      <strong>{{ text('survivalUnavailable') }}</strong>
      <p>{{ text('survivalMissingAqi') }}</p>
    </div>

    <p class="meter-disclaimer">※ {{ text('survivalDisclaimer') }}</p>
  </section>
</template>

<style scoped>
.survival-meter {
  padding: 14px;
  color: var(--inventory-text, #2d321f);
  background: var(--inventory-panel, #e6d5aa);
  border: 4px solid var(--inventory-border, #574a34);
  box-shadow:
    inset 3px 3px 0 var(--inventory-highlight, #fff1c8),
    inset -3px -3px 0 var(--inventory-shadow, #9d855b);
}

.meter-heading,
.score-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meter-heading {
  margin-bottom: 12px;
  color: #b5382d;
}

.meter-heading h3 {
  margin: 0;
  color: var(--inventory-text, #2d321f);
  font-size: 1rem;
}

.score-row {
  margin-bottom: 8px;
}

.score-number {
  font-size: 1.8rem;
  line-height: 1;
}

.score-total {
  color: var(--inventory-muted, #665e4d);
}

.grade-badge {
  margin-left: auto;
  padding: 5px 9px;
  color: #ffffff;
  border: 2px solid #342d25;
  box-shadow: 2px 2px 0 #342d25;
}

.risk-slots {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 5px;
  padding: 0;
  margin: 12px 0 0;
  list-style: none;
}

.risk-slot {
  display: flex;
  min-height: 54px;
  padding: 6px 4px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3px;
  text-align: center;
  background: var(--inventory-slot, #c4aa76);
  border: 2px solid var(--inventory-border, #574a34);
  box-shadow:
    inset 2px 2px 0 var(--inventory-shadow, #9d855b),
    inset -2px -2px 0 var(--inventory-highlight, #fff1c8);
  font-size: 0.72rem;
}

.unavailable-box {
  padding: 15px;
  color: var(--inventory-text, #2d321f);
  background: var(--inventory-warning, #f4c768);
  border: 3px dashed #7b482b;
}

.unavailable-box strong {
  display: block;
  margin-bottom: 6px;
  color: #9b2e26;
  font-size: 1.25rem;
}

.unavailable-box p,
.meter-disclaimer {
  margin: 0;
  line-height: 1.6;
}

.meter-disclaimer {
  margin-top: 10px;
  color: var(--inventory-muted, #665e4d);
  font-size: 0.72rem;
}

:deep(.el-progress-bar__outer) {
  border: 2px solid var(--inventory-border, #574a34);
  border-radius: 0;
  background: var(--inventory-slot-dark, #8d784f);
}

:deep(.el-progress-bar__inner) {
  border-radius: 0;
  transition: width 0.25s steps(5, end);
}

:deep(.el-progress-bar__innerText) {
  color: #ffffff;
  font-weight: 700;
  text-shadow: 1px 1px 0 #222222;
}

@media (max-width: 520px) {
  .risk-slots {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
