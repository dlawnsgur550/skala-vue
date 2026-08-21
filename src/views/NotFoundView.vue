<script setup>
import { useRouter } from 'vue-router'
import { usePreferenceStore } from '../stores/preferenceStore'

const router = useRouter()
const preferenceStore = usePreferenceStore()

const goHome = () => router.push({ name: 'WeatherHome' })
</script>

<template>
  <section class="lost-sector">
    <div class="lost-map" aria-hidden="true"><span>?</span><i></i><i></i><i></i><i></i><i></i></div>
    <div>
      <span class="error-code">ERROR / SECTOR 404</span>
      <h2>{{ preferenceStore.texts.notFoundTitle }}</h2>
      <p>{{ preferenceStore.texts.notFoundLine1 }} {{ preferenceStore.texts.notFoundLine2 }}</p>
      <el-button type="primary" class="return-button" @click="goHome">
        ◀ {{ preferenceStore.texts.goWeatherMain }}
      </el-button>
    </div>
  </section>
</template>

<style scoped>
.lost-sector {
  display: grid;
  grid-template-columns: minmax(220px, 0.7fr) 1fr;
  align-items: center;
  gap: clamp(20px, 6vw, 70px);
  min-height: 560px;
  padding: clamp(24px, 7vw, 70px);
  background: var(--pixel-panel);
  border: var(--pixel-border);
  box-shadow:
    inset 0 0 0 3px var(--pixel-border-highlight),
    var(--pixel-shadow-small);
}

.lost-map {
  position: relative;
  display: grid;
  aspect-ratio: 1;
  place-items: center;
  color: #ffe16c;
  background: #2f6574;
  border: 6px solid var(--pixel-border-color);
  box-shadow: inset 0 0 0 5px #75969a;
  font-size: clamp(4rem, 12vw, 8rem);
}

.lost-map i {
  position: absolute;
  width: 22%;
  height: 22%;
  background: #71984f;
  border: 4px solid #263e29;
}

.lost-map i:nth-of-type(1) {
  top: 12%;
  left: 15%;
}
.lost-map i:nth-of-type(2) {
  top: 10%;
  right: 12%;
}
.lost-map i:nth-of-type(3) {
  bottom: 12%;
  left: 9%;
}
.lost-map i:nth-of-type(4) {
  right: 12%;
  bottom: 10%;
}
.lost-map i:nth-of-type(5) {
  right: 38%;
  bottom: 4%;
}

.lost-map span {
  position: relative;
  z-index: 2;
  text-shadow: 5px 5px 0 #452b22;
}

.error-code {
  color: var(--pixel-danger);
  letter-spacing: 0.12em;
}

.lost-sector h2 {
  margin: 8px 0;
  color: var(--pixel-ink-strong);
  font-size: clamp(1.4rem, 4vw, 2.5rem);
}

.lost-sector p {
  color: var(--pixel-muted);
}

.return-button {
  margin-top: 14px;
  border: 3px solid var(--pixel-border-color);
}

@media (max-width: 680px) {
  .lost-sector {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .lost-map {
    max-width: 300px;
  }
}
</style>
