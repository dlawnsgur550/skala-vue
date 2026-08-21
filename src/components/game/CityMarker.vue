<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-city'])
const configStore = useConfigStore()

const markerStyle = computed(() => ({
  left: `${Number(props.cityItem.mapX) || 50}%`,
  top: `${Number(props.cityItem.mapY) || 50}%`,
}))

const displayTemp = computed(() => {
  if (!Number.isFinite(props.cityItem.temp)) return '--'
  if (configStore.unit === 'fahrenheit') {
    return Math.round((props.cityItem.temp * 9) / 5 + 32)
  }
  return Math.round(props.cityItem.temp)
})

const humidityText = computed(() => {
  return Number.isFinite(props.cityItem.humidity) ? `${props.cityItem.humidity}%` : '--'
})

const markerLabel = computed(() => {
  return `${props.cityName}, ${displayTemp.value}${configStore.unitSymbol}, ${humidityText.value}`
})

const selectCity = () => {
  emit('select-city', props.cityItem.id)
}
</script>

<template>
  <el-popover
    placement="top"
    trigger="hover"
    :width="190"
    :show-after="120"
    :hide-after="60"
    popper-class="pixel-city-popover"
  >
    <template #reference>
      <button
        class="city-marker"
        :class="{ 'city-marker--selected': selected }"
        :style="markerStyle"
        type="button"
        :aria-label="markerLabel"
        :aria-pressed="selected"
        @click.stop="selectCity"
        @pointerdown.stop
      >
        <span class="city-marker__pin" aria-hidden="true">◆</span>
        <span class="city-marker__name">{{ cityName }}</span>
      </button>
    </template>

    <div class="marker-summary">
      <strong>{{ cityItem.icon || '◈' }} {{ cityName }}</strong>
      <span>{{ displayTemp }}{{ configStore.unitSymbol }}</span>
      <span>{{ cityItem.statusText || cityItem.status || '---' }} · {{ humidityText }}</span>
    </div>
  </el-popover>
</template>

<style scoped>
.city-marker {
  position: absolute;
  z-index: 4;
  display: grid;
  min-width: 54px;
  padding: 0;
  color: #fff8cc;
  background: transparent;
  border: 0;
  filter: drop-shadow(2px 3px 0 rgb(10 18 25 / 65%));
  font: inherit;
  text-align: center;
  transform: translate(-50%, -100%);
  cursor: pointer;
  pointer-events: auto;
}

.city-marker__pin {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  margin: 0 auto;
  color: #2e1d0f;
  background: #ffd54a;
  border: 3px solid #472d17;
  box-shadow:
    inset -3px -3px 0 #d58c27,
    inset 3px 3px 0 #fff09c;
  transform: rotate(45deg);
}

.city-marker__pin::first-letter {
  transform: rotate(-45deg);
}

.city-marker__name {
  margin-top: 5px;
  padding: 3px 6px;
  color: #fffbe5;
  background: rgb(24 38 46 / 88%);
  border: 2px solid #0e1a20;
  box-shadow: inset 0 0 0 1px #6f8c7a;
  font-size: 0.76rem;
  line-height: 1.2;
  white-space: nowrap;
}

.city-marker:hover,
.city-marker:focus-visible,
.city-marker--selected {
  z-index: 7;
  outline: none;
  transform: translate(-50%, -100%) scale(1.12);
}

.city-marker:focus-visible .city-marker__name,
.city-marker--selected .city-marker__name {
  color: #1a2619;
  background: #b9e86b;
  border-color: #eaffae;
  box-shadow:
    inset 0 0 0 2px #52723b,
    0 0 0 3px #17281d;
}

.city-marker--selected .city-marker__pin {
  background: #f47b48;
  box-shadow:
    inset -3px -3px 0 #a63d2a,
    inset 3px 3px 0 #ffc16f;
  animation: marker-pulse 900ms steps(2, end) infinite;
}

.marker-summary {
  display: grid;
  gap: 5px;
  color: #f6f2d6;
  font-family: inherit;
}

.marker-summary strong {
  color: #c9f27b;
}

@keyframes marker-pulse {
  50% {
    filter: brightness(1.35);
  }
}

@media (prefers-reduced-motion: reduce) {
  .city-marker--selected .city-marker__pin {
    animation: none;
  }
}
</style>
