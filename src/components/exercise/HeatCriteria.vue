<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'
import { usePreferenceStore } from '../../stores/preferenceStore'

const props = defineProps({
  hotTemperature: {
    type: Number,
    required: true,
  },
  hotHumidity: {
    type: Number,
    required: true,
  },
  hotCities: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update-temperature', 'update-humidity'])
const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()

const displayTemperature = computed(() => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((props.hotTemperature * 9) / 5 + 32)
  }
  return props.hotTemperature
})

const convertTemperature = (temperature) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temperature * 9) / 5 + 32)
  }
  return temperature
}

const updateTemperature = (event) => {
  const inputTemperature = Number(event.target.value)
  if (configStore.unit === 'fahrenheit') {
    emit('update-temperature', Math.round(((inputTemperature - 32) * 5) / 9))
    return
  }
  emit('update-temperature', inputTemperature)
}

const updateHumidity = (event) => {
  emit('update-humidity', Number(event.target.value))
}
</script>

<template>
  <div class="heat-criteria">
    <h2>{{ preferenceStore.texts.heatCriteriaTitle }}</h2>

    <label for="hot-temperature">{{ preferenceStore.texts.tempCriteria }}</label>
    <input
      id="hot-temperature"
      type="number"
      :value="displayTemperature"
      @input="updateTemperature"
    />
    {{ configStore.unitSymbol }}

    <label for="hot-humidity">{{ preferenceStore.texts.humidityCriteria }}</label>
    <input id="hot-humidity" type="number" :value="hotHumidity" @input="updateHumidity" />
    %

    <p>
      {{ preferenceStore.texts.matchingCities }}:
      <strong>{{ hotCities.length }}{{ preferenceStore.texts.cityCount }}</strong>
    </p>

    <ul v-if="hotCities.length > 0">
      <li v-for="city in hotCities" :key="city.id">
        {{ preferenceStore.texts.cityNames[city.id] }} - {{ convertTemperature(city.temp)
        }}{{ configStore.unitSymbol }} / {{ preferenceStore.texts.humidity }} {{ city.humidity }}%
      </li>
    </ul>
    <p v-else>{{ preferenceStore.texts.noMatchingCities }}</p>
  </div>
</template>

<style scoped>
.heat-criteria h2 {
  margin-top: 0;
}

.heat-criteria label {
  display: block;
  margin-top: 8px;
}

.heat-criteria input {
  width: 120px;
  padding: 6px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #94a3b8;
}
</style>
