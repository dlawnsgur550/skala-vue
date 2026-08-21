<script setup>
import { useRouter } from 'vue-router'
import { usePreferenceStore } from '../stores/preferenceStore'

const router = useRouter()
const preferenceStore = usePreferenceStore()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <section class="not-found-container">
    <div class="not-found-content">
      <div class="error-icon">☀️❓</div>
      <h2>{{ preferenceStore.texts.notFoundTitle }}</h2>
      <p>
        {{ preferenceStore.texts.notFoundLine1 }}<br />{{ preferenceStore.texts.notFoundLine2 }}
      </p>
      <button class="home-button" @click="goHome">{{ preferenceStore.texts.goWeatherMain }}</button>
    </div>
  </section>
</template>

<style scoped>
.not-found-container {
  display: grid;
  place-items: center;
  min-height: 560px;
  padding: 24px;
  color: #24324a;
  background: #f8fafc;
}

.not-found-content {
  padding: 42px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
}

.error-icon {
  font-size: 5rem;
}

.not-found-content h2 {
  font-weight: bold;
}

.not-found-content p {
  color: #64748b;
}

.home-button {
  padding: 11px 24px;
  color: #ffffff;
  background: #087ff5;
  border: 0;
  border-radius: 24px;
  cursor: pointer;
}
</style>
