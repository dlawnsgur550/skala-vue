<script setup>
import { usePreferenceStore } from '../../stores/preferenceStore'

const preferenceStore = usePreferenceStore()

const changeLanguage = (event) => {
  preferenceStore.setLanguage(event.target.value)
}
</script>

<template>
  <div class="preference-controls">
    <span>
      {{ preferenceStore.texts.appearance }}:
      <strong>{{ preferenceStore.isDark ? preferenceStore.texts.dark : preferenceStore.texts.light }}</strong>
    </span>
    <button @click="preferenceStore.toggleTheme">
      {{ preferenceStore.isDark ? preferenceStore.texts.changeToLight : preferenceStore.texts.changeToDark }}
    </button>

    <label for="language-select">{{ preferenceStore.texts.language }}</label>
    <select id="language-select" :value="preferenceStore.language" @change="changeLanguage">
      <option value="ko">한국어</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>
  </div>
</template>

<style scoped>
.preference-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

button,
select {
  padding: 7px 10px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #64748b;
  border-radius: 4px;
  cursor: pointer;
}
</style>
