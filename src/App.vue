<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
import PreferenceControls from './components/exercise/PreferenceControls.vue'
import { usePreferenceStore } from './stores/preferenceStore'

const preferenceStore = usePreferenceStore()
</script>

<template>
  <div class="theme-page" :class="{ dark: preferenceStore.isDark }">
    <div class="app-container">
      <header>
        <h1>{{ preferenceStore.texts.appTitle }}</h1>

        <div class="top-bar">
          <nav class="navigation-bar" :aria-label="preferenceStore.texts.navAria">
            <RouterLink to="/" class="nav-item">{{ preferenceStore.texts.navDashboard }}</RouterLink>
            <span class="divider">|</span>
            <RouterLink to="/about" class="nav-item">{{ preferenceStore.texts.navAbout }}</RouterLink>
            <span class="divider">|</span>
            <RouterLink to="/criteria" class="nav-item">{{ preferenceStore.texts.navCriteria }}</RouterLink>
          </nav>

          <div class="setting-bar">
            <UnitToggler />
            <PreferenceControls />
          </div>
        </div>
      </header>

      <main class="router-content">
        <RouterView />
      </main>

      <footer class="data-attribution">
        <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
          Weather data provided by OpenWeather
        </a>
        <span>·</span>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Air quality data by Open-Meteo
        </a>
      </footer>
    </div>
  </div>
</template>

<style>
#app {
  display: block;
  width: 100%;
  max-width: none;
  min-height: 100vh;
}

.theme-page {
  min-height: 100vh;
  color: #24324a;
  background: #eaf0f6;
}

.app-container {
  width: min(920px, 100%);
  margin: 0 auto;
  padding: 24px;
  color: #24324a;
  background: #f4f8fc;
}

.app-container h1 {
  margin-top: 0;
  padding-bottom: 14px;
  border-bottom: 1px solid #cbd5e1;
}

.top-bar {
  margin: 16px 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.navigation-bar,
.setting-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px;
}

.setting-bar {
  border-top: 1px solid #e2e8f0;
}

.nav-item {
  padding: 4px 2px;
  color: #64748b;
  text-decoration: none;
}

.nav-item.router-link-active {
  color: #0788d1;
  border-bottom: 2px solid #0788d1;
  font-weight: bold;
}

.divider {
  color: #cbd5e1;
}

.router-content {
  min-width: 0;
}

.data-attribution {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
  color: #64748b;
  font-size: 0.8rem;
}

.data-attribution a {
  color: inherit;
}

/* 다크 모드는 새 기능 없이 :class와 일반 CSS 선택자로 적용한다. */
.theme-page.dark,
.theme-page.dark .app-container,
.theme-page.dark .dashboard-wrapper {
  color: #e5edf7;
  background: #172033;
}

.theme-page.dark .top-bar,
.theme-page.dark .base-dashboard-card,
.theme-page.dark .weather-card,
.theme-page.dark .detail-container,
.theme-page.dark .about-container,
.theme-page.dark .criteria-container,
.theme-page.dark .not-found-content {
  color: #e5edf7;
  background: #222e43;
  border-color: #52627a;
}

.theme-page.dark .setting-bar,
.theme-page.dark .app-container h1,
.theme-page.dark .detail-container h2,
.theme-page.dark .about-container h2,
.theme-page.dark .criteria-container h2 {
  border-color: #52627a;
}

.theme-page.dark .info-card,
.theme-page.dark .missing-data,
.theme-page.dark .detail-section,
.theme-page.dark .description-box,
.theme-page.dark .not-found-container {
  color: #e5edf7;
  background: #182338;
}

.theme-page.dark .criteria-box {
  color: #ffe5c2;
  background: #432b1f;
}

.theme-page.dark .app-container input,
.theme-page.dark .app-container select,
.theme-page.dark .preference-controls button,
.theme-page.dark .detail-button {
  color: #f8fafc;
  background: #111827;
  border-color: #718096;
}

.theme-page.dark .status-bar {
  color: #d8ffe5;
  background: #153d29;
  border-color: #3f8a5d;
}

.theme-page.dark .forecast-card {
  color: #e5edf7;
  background: #111827;
  border-color: #52627a;
}

.theme-page.dark .data-attribution {
  color: #b8c6d9;
}

.theme-page.dark .nav-item,
.theme-page.dark .not-found-content p {
  color: #c4d1e1;
}

.theme-page.dark .nav-item.router-link-active {
  color: #5fc5ff;
}

@media (max-width: 700px) {
  .app-container {
    padding: 14px;
  }

  .divider {
    display: none;
  }

  .setting-bar,
  .unit-toggler,
  .preference-controls {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
