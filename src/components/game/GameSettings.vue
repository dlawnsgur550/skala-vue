<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'
import { usePreferenceStore } from '../../stores/preferenceStore'

const props = defineProps({
  cities: {
    type: Array,
    default: () => [],
  },
  selectedCityId: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  labels: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['select-city', 'refresh'])

const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()

const fallbackLabels = {
  ko: {
    title: '탐험 설정',
    theme: '화면',
    light: '일반',
    dark: '야간',
    unit: '온도 단위',
    language: '언어',
    city: '도시 선택',
    cityPlaceholder: '탐험할 도시 선택',
    refresh: '날씨 새로고침',
  },
  en: {
    title: 'EXPEDITION SETTINGS',
    theme: 'Theme',
    light: 'Light',
    dark: 'Night',
    unit: 'Temperature unit',
    language: 'Language',
    city: 'Select city',
    cityPlaceholder: 'Choose a city to explore',
    refresh: 'Refresh weather',
  },
  ja: {
    title: '探索設定',
    theme: '画面',
    light: 'ライト',
    dark: 'ナイト',
    unit: '温度単位',
    language: '言語',
    city: '都市選択',
    cityPlaceholder: '探索する都市を選択',
    refresh: '天気を更新',
  },
}

const copy = computed(() => {
  const fallback = fallbackLabels[preferenceStore.language] || fallbackLabels.ko
  const storeTexts = preferenceStore.texts || {}

  return {
    ...fallback,
    theme: storeTexts.appearance || fallback.theme,
    light: storeTexts.light || fallback.light,
    dark: storeTexts.dark || fallback.dark,
    unit: storeTexts.unitLabel || fallback.unit,
    language: storeTexts.language || fallback.language,
    refresh: storeTexts.refreshWeather || fallback.refresh,
    ...props.labels,
  }
})

const darkMode = computed({
  get: () => preferenceStore.isDark,
  set: (nextValue) => {
    if (Boolean(nextValue) !== preferenceStore.isDark) {
      preferenceStore.toggleTheme()
    }
  },
})

const fahrenheitMode = computed({
  get: () => configStore.unit === 'fahrenheit',
  set: (nextValue) => {
    const nextUnit = nextValue ? 'fahrenheit' : 'celsius'
    if (configStore.unit !== nextUnit) {
      configStore.toggleUnit()
    }
  },
})

const selectedLanguage = computed({
  get: () => preferenceStore.language,
  set: (language) => preferenceStore.setLanguage(language),
})

const selectedCity = computed({
  get: () => props.selectedCityId,
  set: (cityId) => {
    if (cityId && cityId !== props.selectedCityId) {
      emit('select-city', cityId)
    }
  },
})

const languageOptions = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
]

const selectPopperClass = computed(() => {
  return preferenceStore.isDark
    ? 'game-settings-select-popper--dark'
    : 'game-settings-select-popper--light'
})

const cityOptions = computed(() => {
  const seenIds = new Set()

  return props.cities.reduce((options, city) => {
    const cityId = typeof city === 'string' ? city : city?.id || city?.cityId
    if (!cityId || seenIds.has(cityId)) return options

    seenIds.add(cityId)
    options.push({
      value: cityId,
      label:
        props.labels.cityNames?.[cityId] ||
        preferenceStore.texts?.cityNames?.[cityId] ||
        city?.name ||
        cityId,
    })
    return options
  }, [])
})
</script>

<template>
  <section
    class="game-settings"
    :class="{ 'is-dark': preferenceStore.isDark }"
    role="region"
    :aria-label="copy.title"
  >
    <div class="game-settings__title">
      <span aria-hidden="true">⚙</span>
      <span>{{ copy.title }}</span>
    </div>

    <div class="game-settings__controls">
      <div class="setting-slot setting-slot--switch">
        <label for="theme-setting-switch" class="setting-slot__label">{{ copy.theme }}</label>
        <el-switch
          id="theme-setting-switch"
          v-model="darkMode"
          :active-text="copy.dark"
          :inactive-text="copy.light"
        />
      </div>

      <div class="setting-slot setting-slot--switch">
        <label for="unit-setting-switch" class="setting-slot__label">{{ copy.unit }}</label>
        <el-switch
          id="unit-setting-switch"
          v-model="fahrenheitMode"
          active-text="℉"
          inactive-text="℃"
        />
      </div>

      <label class="setting-slot" for="game-language-select">
        <span class="setting-slot__label">{{ copy.language }}</span>
        <el-select
          id="game-language-select"
          v-model="selectedLanguage"
          class="setting-slot__select"
          :popper-class="selectPopperClass"
          :aria-label="copy.language"
        >
          <el-option
            v-for="language in languageOptions"
            :key="language.value"
            :label="language.label"
            :value="language.value"
          />
        </el-select>
      </label>

      <label class="setting-slot setting-slot--city" for="game-city-select">
        <span class="setting-slot__label">{{ copy.city }}</span>
        <el-select
          id="game-city-select"
          v-model="selectedCity"
          class="setting-slot__select"
          :placeholder="copy.cityPlaceholder"
          :popper-class="selectPopperClass"
          :aria-label="copy.city"
          filterable
        >
          <el-option
            v-for="city in cityOptions"
            :key="city.value"
            :label="city.label"
            :value="city.value"
          />
        </el-select>
      </label>

      <el-button
        class="game-settings__refresh"
        type="primary"
        :loading="loading"
        :aria-label="copy.refresh"
        @click="emit('refresh')"
      >
        <span aria-hidden="true">↻</span>
        {{ copy.refresh }}
      </el-button>
    </div>
  </section>
</template>

<style scoped>
.game-settings {
  --settings-ink: var(--game-ink, #302719);
  --settings-panel: var(--game-panel, #e8d59e);
  --settings-slot: var(--game-slot, #f4e7bf);
  --settings-edge-dark: var(--game-edge-dark, #4c3b26);
  --settings-edge-light: var(--game-edge-light, #fff1c7);
  --settings-select-bg: #fff7dc;
  --settings-select-text: #26372a;
  --settings-select-placeholder: #677264;
  --settings-select-icon: #405444;
  color: var(--settings-ink);
  background: var(--settings-panel);
  border: 4px solid var(--settings-edge-dark);
  box-shadow:
    inset 3px 3px 0 var(--settings-edge-light),
    inset -3px -3px 0 #9b7b4d,
    0 5px 0 rgb(0 0 0 / 22%);
  font-family: var(--pixel-font, 'Galmuri11', 'Courier New', monospace);
  image-rendering: pixelated;
}

.game-settings__title {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 34px;
  padding: 7px 12px;
  color: #fff8dc;
  background: #3f5f3b;
  border-bottom: 4px solid var(--settings-edge-dark);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-shadow: 2px 2px 0 #20331f;
}

.game-settings__controls {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(130px, 0.8fr)) minmax(150px, 1fr) minmax(190px, 1.25fr)
    auto;
  gap: 8px;
  align-items: stretch;
  grid-auto-rows: minmax(72px, auto);
  padding: 10px;
}

.setting-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  min-height: 58px;
  padding: 7px 9px;
  background: var(--settings-slot);
  border: 3px solid var(--settings-edge-dark);
  box-shadow:
    inset 2px 2px 0 var(--settings-edge-light),
    inset -2px -2px 0 #b39664;
}

.setting-slot--switch {
  gap: 4px;
}

.setting-slot__label {
  margin-bottom: 4px;
  overflow: hidden;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.setting-slot__select {
  width: 100%;
}

.game-settings__refresh {
  align-self: stretch;
  width: 100%;
  height: 100%;
  min-height: 72px;
  margin: 0;
  padding-inline: 14px;
}

.game-settings :deep(.el-switch__label) {
  color: var(--settings-ink);
  font-family: inherit;
  font-size: 0.68rem;
  font-weight: 700;
}

.game-settings :deep(.el-switch__core),
.game-settings :deep(.el-select__wrapper),
.game-settings :deep(.el-button) {
  border-radius: 0;
}

.game-settings :deep(.el-switch__core) {
  border: 2px solid var(--settings-edge-dark);
  box-shadow: inset 1px 1px 0 rgb(255 255 255 / 40%);
}

.game-settings :deep(.el-switch.is-checked .el-switch__core) {
  background: #486d43;
  border-color: #283e26;
}

.game-settings :deep(.el-select__wrapper) {
  min-height: 30px;
  color: var(--settings-select-text);
  background: var(--settings-select-bg);
  border: 2px solid var(--settings-edge-dark);
  box-shadow: inset 2px 2px 0 #c9b580;
  font-family: inherit;
}

.game-settings :deep(.el-select__selected-item),
.game-settings :deep(.el-select__input) {
  color: var(--settings-select-text);
  font-weight: 700;
}

.game-settings :deep(.el-select__placeholder.is-transparent) {
  color: var(--settings-select-placeholder);
  opacity: 1;
}

.game-settings :deep(.el-select__caret) {
  color: var(--settings-select-icon);
}

.game-settings :deep(.el-button) {
  color: #fff8dc;
  background: #39743c;
  border: 3px solid #1d3e22;
  box-shadow:
    inset 2px 2px 0 #72aa6d,
    inset -2px -2px 0 #234c28;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: normal;
}

.game-settings :deep(.el-button:hover),
.game-settings :deep(.el-button:focus-visible) {
  color: #fff;
  background: #4d8b4f;
  outline: 3px solid #f0c75e;
  outline-offset: 2px;
}

.game-settings.is-dark {
  --settings-ink: #e8f0df;
  --settings-panel: #26352c;
  --settings-slot: #34473a;
  --settings-edge-dark: #111b15;
  --settings-edge-light: #617963;
  --settings-select-bg: #18251e;
  --settings-select-text: #fff7d2;
  --settings-select-placeholder: #b9c9ae;
  --settings-select-icon: #d6e5b8;
}

.game-settings.is-dark :deep(.el-select__wrapper) {
  box-shadow: inset 2px 2px 0 #111914;
}

:global(.game-settings-select-popper--light),
:global(.game-settings-select-popper--dark) {
  border: 3px solid #3d493e !important;
  border-radius: 0 !important;
  font-family: var(--pixel-font, 'Galmuri11', 'Courier New', monospace);
}

:global(.game-settings-select-popper--light) {
  background: #fff7dc !important;
}

:global(.game-settings-select-popper--dark) {
  background: #18251e !important;
  border-color: #71857d !important;
}

:global(.game-settings-select-popper--light .el-select-dropdown__item) {
  color: #26372a;
  font-weight: 700;
}

:global(.game-settings-select-popper--dark .el-select-dropdown__item) {
  color: #e8f0df;
  font-weight: 700;
}

:global(.game-settings-select-popper--light .el-select-dropdown__item.is-hovering),
:global(.game-settings-select-popper--light .el-select-dropdown__item.is-selected),
:global(.game-settings-select-popper--dark .el-select-dropdown__item.is-hovering),
:global(.game-settings-select-popper--dark .el-select-dropdown__item.is-selected) {
  color: #172619;
  background: #b9df74;
}

@media (max-width: 1050px) {
  .game-settings__controls {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }

  .setting-slot--city,
  .game-settings__refresh {
    grid-column: span 2;
  }
}

@media (max-width: 560px) {
  .game-settings__controls {
    grid-template-columns: 1fr;
  }

  .setting-slot--city,
  .game-settings__refresh {
    grid-column: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .game-settings :deep(*) {
    transition: none !important;
  }
}
</style>
