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
  <section class="about-container">
    <h2>{{ preferenceStore.texts.aboutTitle }}</h2>

    <div class="description-box">
      <p>{{ preferenceStore.texts.aboutIntro }}</p>
      <ul>
        <li v-for="item in preferenceStore.texts.aboutItems" :key="item">{{ item }}</li>
      </ul>
    </div>

    <button class="home-button" @click="goHome">{{ preferenceStore.texts.goDashboard }}</button>
  </section>
</template>

<style scoped>
.about-container {
  padding: 20px;
  color: #24324a;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.about-container h2 {
  margin-top: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #cbd5e1;
}

.description-box {
  padding: 16px;
  background: #f1f5f9;
  border-radius: 6px;
}

.description-box li {
  margin-bottom: 6px;
}

.home-button {
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  color: #ffffff;
  background: #1683bd;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}
</style>
