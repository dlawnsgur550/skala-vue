<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'
import { usePreferenceStore } from '../../stores/preferenceStore'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  isHot: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()

const cityName = computed(() => preferenceStore.texts.cityNames[props.cityItem.id])
const statusText = computed(() => preferenceStore.texts.statuses[props.cityItem.status])
const displayTemp = computed(() => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((props.cityItem.temp * 9) / 5 + 32)
  }
  return props.cityItem.temp
})

const selectCard = () => {
  emit('select-card', props.cityItem.id)
}

const clickDetail = () => {
  emit('click-detail', props.cityItem.id)
}
</script>

<template>
  <article class="weather-card" @click="selectCard">
    <div>
      <h3>{{ cityItem.icon }} {{ cityName }} ({{ statusText }})</h3>
      <p>{{ preferenceStore.texts.currentTemp }}: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p>{{ preferenceStore.texts.currentHumidity }}: {{ cityItem.humidity }}%</p>

      <span v-if="isHot" class="temperature-label hot">{{ preferenceStore.texts.hotHumid }}</span>
      <span v-else class="temperature-label cool">{{ preferenceStore.texts.belowCriteria }}</span>
    </div>

    <button class="detail-button" @click.stop="clickDetail">
      {{ preferenceStore.texts.details }}
    </button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 10px;
  padding: 16px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
}

.weather-card h3,
.weather-card p {
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
  background: #d83b31;
}

.cool {
  background: #2176ae;
}

.detail-button {
  padding: 8px 12px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #64748b;
  cursor: pointer;
}

@media (max-width: 600px) {
  .weather-card {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
