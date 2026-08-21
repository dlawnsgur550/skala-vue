<script setup>
import { usePreferenceStore } from '../../stores/preferenceStore'

defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])
const preferenceStore = usePreferenceStore()

const handleInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <label for="city-search">{{ preferenceStore.texts.searchLabel }}</label>
    <input
      id="city-search"
      type="text"
      :value="currentQuery"
      :placeholder="preferenceStore.texts.searchPlaceholder"
      @input="handleInput"
    />
    <p>
      {{ preferenceStore.texts.searchingCity }}:
      <strong>{{ currentQuery || preferenceStore.texts.beforeInput }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar label {
  display: block;
  margin-bottom: 8px;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #94a3b8;
}

.search-bar p {
  margin: 8px 0 0;
}
</style>
