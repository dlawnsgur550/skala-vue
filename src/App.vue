<script setup>
import { usePreferenceStore } from './stores/preferenceStore'

const preferenceStore = usePreferenceStore()
</script>

<template>
  <div class="theme-page" :class="{ dark: preferenceStore.isDark }">
    <div class="scanline" aria-hidden="true"></div>

    <div class="app-container">
      <header class="game-header">
        <div class="brand-lockup">
          <span class="brand-emblem" aria-hidden="true"> <i></i><i></i><i></i><i></i> </span>
          <div>
            <span class="system-name">WEATHER SURVIVAL SYSTEM</span>
            <h1>{{ preferenceStore.texts.game.title }}</h1>
            <p>{{ preferenceStore.texts.game.subtitle }}</p>
          </div>
        </div>

        <nav class="navigation-bar" :aria-label="preferenceStore.texts.navAria">
          <RouterLink to="/" class="nav-item">
            <span aria-hidden="true">01</span>{{ preferenceStore.texts.navDashboard }}
          </RouterLink>
          <RouterLink to="/criteria" class="nav-item">
            <span aria-hidden="true">02</span>{{ preferenceStore.texts.game.survivalTitle }}
          </RouterLink>
          <RouterLink to="/about" class="nav-item">
            <span aria-hidden="true">03</span>{{ preferenceStore.texts.navAbout }}
          </RouterLink>
        </nav>
      </header>

      <main class="router-content">
        <RouterView />
      </main>

      <footer class="data-attribution">
        <span class="footer-status">DATA LINK / ACTIVE</span>
        <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
          Weather: OpenWeather
        </a>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Air quality: Open-Meteo
        </a>
        <a href="https://atmosphere.copernicus.eu/" target="_blank" rel="noreferrer">
          CAMS ENSEMBLE
        </a>
        <a href="https://github.com/quiple/galmuri" target="_blank" rel="noreferrer">
          Font: Galmuri (OFL-1.1)
        </a>
      </footer>
    </div>
  </div>
</template>

<style>
#app {
  display: block;
  width: 100%;
  min-height: 100vh;
}

.theme-page {
  --pixel-bg: #172b32;
  --pixel-bg-grid: #213c42;
  --pixel-panel: #2c4143;
  --pixel-panel-deep: #203337;
  --pixel-border-color: #111d20;
  --pixel-border-highlight: #6b817a;
  --pixel-ink: #dce8c8;
  --pixel-ink-strong: #fffbd5;
  --pixel-muted: #a7baaa;
  --pixel-accent: #caec75;
  --pixel-warm: #f4bd59;
  --pixel-danger: #ee785e;
  --pixel-border: 4px solid var(--pixel-border-color);
  --pixel-shadow-small: 4px 4px 0 rgb(8 15 17 / 45%);
  --game-text: var(--pixel-ink);
  --game-ink: #edf7d2;
  --game-panel: var(--pixel-panel);
  --game-slot: #3b504b;
  --game-edge-dark: #111d20;
  --game-edge-light: #71857d;
  --game-panel-strong: var(--pixel-panel-deep);
  --game-border-dark: var(--pixel-border-color);
  --game-border-light: var(--pixel-border-highlight);
  min-height: 100vh;
  color: var(--pixel-ink);
  background-color: var(--pixel-bg);
  background-image:
    linear-gradient(90deg, transparent 31px, var(--pixel-bg-grid) 32px),
    linear-gradient(transparent 31px, var(--pixel-bg-grid) 32px);
  background-size: 32px 32px;
  transition:
    color 120ms steps(2),
    background-color 120ms steps(2);
}

.theme-page:not(.dark) {
  --pixel-bg: #bbd2c0;
  --pixel-bg-grid: #acc5b3;
  --pixel-panel: #e4dfb9;
  --pixel-panel-deep: #d1caa2;
  --pixel-border-color: #3d493e;
  --pixel-border-highlight: #fff7d0;
  --pixel-ink: #2f4135;
  --pixel-ink-strong: #17291d;
  --pixel-muted: #5f7464;
  --pixel-accent: #3f722d;
  --pixel-warm: #b66d24;
  --pixel-danger: #a13a2d;
  --game-ink: #302719;
  --game-slot: #f4e7bf;
  --game-edge-dark: #4c3b26;
  --game-edge-light: #fff1c7;
}

.scanline {
  position: fixed;
  z-index: 50;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 3px,
    rgb(5 12 10 / 5%) 4px
  );
  pointer-events: none;
}

.app-container {
  position: relative;
  width: min(1220px, calc(100% - 28px));
  margin: 0 auto;
  padding: 22px 0 16px;
}

.game-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 24px;
  margin-bottom: 16px;
  padding: 16px;
  background: var(--pixel-panel-deep);
  border: var(--pixel-border);
  box-shadow:
    inset 0 0 0 3px var(--pixel-border-highlight),
    7px 7px 0 rgb(8 15 17 / 42%);
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.brand-lockup h1 {
  margin: 2px 0;
  color: var(--pixel-ink-strong);
  font-size: clamp(1.25rem, 3vw, 2.15rem);
  line-height: 1.25;
  text-shadow: 3px 3px 0 rgb(10 18 15 / 30%);
}

.brand-lockup p,
.system-name {
  margin: 0;
  color: var(--pixel-muted);
  font-size: clamp(0.65rem, 1.4vw, 0.8rem);
}

.system-name {
  color: var(--pixel-accent);
  letter-spacing: 0.12em;
}

.brand-emblem {
  display: grid;
  flex: 0 0 auto;
  grid-template-columns: repeat(2, 17px);
  gap: 3px;
  width: 48px;
  height: 48px;
  place-content: center;
  background: #355f37;
  border: 4px solid var(--pixel-border-color);
  box-shadow: inset 0 0 0 3px #79a64e;
  transform: rotate(45deg);
}

.brand-emblem i {
  display: block;
  width: 17px;
  height: 17px;
  background: #bbdf62;
}

.brand-emblem i:nth-child(2),
.brand-emblem i:nth-child(3) {
  background: #f2bd53;
}

.navigation-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 36px;
  padding: 7px 9px;
  color: var(--pixel-muted);
  background: var(--pixel-panel);
  border: 2px solid var(--pixel-border-color);
  box-shadow: inset 0 0 0 1px var(--pixel-border-highlight);
  font-size: 0.76rem;
  text-decoration: none;
}

.nav-item span {
  color: var(--pixel-warm);
}

.nav-item:hover,
.nav-item:focus-visible,
.nav-item.router-link-exact-active {
  color: #17291d;
  background: #c8e66f;
  outline: none;
}

.router-content {
  min-width: 0;
}

.data-attribution {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 14px;
  margin-top: 16px;
  padding: 10px;
  color: var(--pixel-muted);
  background: var(--pixel-panel-deep);
  border: 3px solid var(--pixel-border-color);
  font-size: 0.65rem;
}

.data-attribution a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.footer-status {
  color: var(--pixel-accent);
}

@media (max-width: 820px) {
  .game-header {
    grid-template-columns: 1fr;
  }

  .navigation-bar {
    justify-content: stretch;
  }

  .nav-item {
    flex: 1 1 150px;
    justify-content: center;
  }
}

@media (max-width: 540px) {
  .app-container {
    width: min(100% - 14px, 1220px);
    padding-top: 8px;
  }

  .game-header {
    padding: 12px;
  }

  .brand-emblem {
    display: none;
  }
}
</style>
