<script setup>
import { useConfigStore } from '../../stores/configStore'
import { usePreferenceStore } from '../../stores/preferenceStore'

const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()
</script>

<template>
  <div class="unit-toggler">
    <span>
      {{ preferenceStore.texts.unitLabel }}:
      <strong>
        {{
          configStore.unit === 'celsius'
            ? preferenceStore.texts.celsius
            : preferenceStore.texts.fahrenheit
        }}{{ configStore.unitSymbol }}
      </strong>
    </span>
    <button @click="configStore.toggleUnit">{{ preferenceStore.texts.changeUnit }}</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
}

button {
  padding: 7px 10px;
  color: #ffffff;
  background: #445d78;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}
</style>
