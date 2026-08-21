<script setup>
import { useRouter } from 'vue-router'
import { usePreferenceStore } from '../stores/preferenceStore'

const router = useRouter()
const preferenceStore = usePreferenceStore()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <section class="criteria-container">
    <h2>{{ preferenceStore.texts.criteriaPageTitle }}</h2>

    <div class="criteria-box">
      <p><strong>{{ preferenceStore.texts.criteriaBasic }}</strong></p>
      <p>{{ preferenceStore.texts.criteriaExplanation }}</p>
      <p>{{ preferenceStore.texts.criteriaCondition }}</p>
    </div>

    <button class="home-button" @click="goHome">{{ preferenceStore.texts.goWeather }}</button>
  </section>
</template>

<style scoped>
.criteria-container {
  padding: 20px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.criteria-container h2 {
  margin-top: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #cbd5e1;
}

.criteria-box {
  padding: 16px;
  background: #fff7ed;
  border-left: 5px solid #ea580c;
  border-radius: 6px;
}

.home-button {
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  color: #ffffff;
  background: #d64d0a;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}
</style>
