<script setup>
import { computed, reactive, ref } from 'vue'
import CityMarker from './CityMarker.vue'

defineProps({
  weatherList: {
    type: Array,
    default: () => [],
  },
  selectedCityId: {
    type: String,
    default: '',
  },
  cityNames: {
    type: Object,
    default: () => ({}),
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

const emit = defineEmits(['select-city'])

const camera = reactive({
  x: 0,
  y: 0,
  zoom: 1,
  dragging: false,
  pointerId: null,
  pointerStartX: 0,
  pointerStartY: 0,
  cameraStartX: 0,
  cameraStartY: 0,
  moved: false,
})

const lastDragFinishedAt = ref(0)
const MIN_ZOOM = 0.75
const MAX_ZOOM = 2
const ZOOM_STEP = 0.1

const worldStyle = computed(() => ({
  transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.zoom})`,
}))

const clampPosition = (value, zoom = camera.zoom) => {
  const limit = 360 * zoom
  return Math.min(limit, Math.max(-limit, value))
}

const zoomMap = (event) => {
  if (event.deltaY === 0) return

  const zoomDirection = event.deltaY < 0 ? 1 : -1
  const nextZoom = Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, Number((camera.zoom + zoomDirection * ZOOM_STEP).toFixed(2))),
  )
  if (nextZoom === camera.zoom) return

  const viewport = event.currentTarget.getBoundingClientRect()
  const pointerX = event.clientX - viewport.left - viewport.width / 2
  const pointerY = event.clientY - viewport.top - viewport.height / 2
  const zoomRatio = nextZoom / camera.zoom

  camera.x = clampPosition(pointerX - (pointerX - camera.x) * zoomRatio, nextZoom)
  camera.y = clampPosition(pointerY - (pointerY - camera.y) * zoomRatio, nextZoom)
  camera.zoom = nextZoom
}

const startDragging = (event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  camera.dragging = true
  camera.moved = false
  camera.pointerId = event.pointerId
  camera.pointerStartX = event.clientX
  camera.pointerStartY = event.clientY
  camera.cameraStartX = camera.x
  camera.cameraStartY = camera.y
  event.currentTarget.setPointerCapture(event.pointerId)
}

const dragMap = (event) => {
  if (!camera.dragging || camera.pointerId !== event.pointerId) return

  const deltaX = event.clientX - camera.pointerStartX
  const deltaY = event.clientY - camera.pointerStartY
  if (Math.hypot(deltaX, deltaY) > 6) camera.moved = true

  camera.x = clampPosition(camera.cameraStartX + deltaX)
  camera.y = clampPosition(camera.cameraStartY + deltaY)
}

const stopDragging = (event) => {
  if (camera.pointerId !== event.pointerId) return

  if (camera.moved) lastDragFinishedAt.value = Date.now()
  camera.dragging = false
  camera.pointerId = null

  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}

const selectCity = (cityId) => {
  if (Date.now() - lastDragFinishedAt.value < 180) return
  emit('select-city', cityId)
}

</script>

<template>
  <section class="weather-game-map" :aria-busy="loading">
    <div
      class="map-viewport"
      :class="{ 'map-viewport--dragging': camera.dragging }"
      role="region"
      :aria-label="labels.mapHint || '대한민국 픽셀 날씨 지도'"
      @pointerdown="startDragging"
      @pointermove="dragMap"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
      @wheel.prevent="zoomMap"
    >
      <div class="map-world" :style="worldStyle">
        <svg
          class="korea-pixel-map"
          viewBox="0 0 1000 720"
          preserveAspectRatio="none"
          aria-hidden="true"
          shape-rendering="crispEdges"
        >
          <defs>
            <pattern id="ocean-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#477886" stroke-width="2" />
            </pattern>
            <pattern id="land-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <rect width="32" height="32" fill="#759c52" />
              <rect width="16" height="16" fill="#80aa59" />
              <rect x="16" y="16" width="16" height="16" fill="#6d914c" />
            </pattern>
          </defs>

          <rect width="1000" height="720" fill="#2f6574" />
          <rect width="1000" height="720" fill="url(#ocean-grid)" opacity="0.45" />

          <polygon
            class="land-shadow"
            points="400,76 552,76 552,104 600,104 600,156 640,156 640,228 676,228 676,320 704,320 704,432 676,432 676,496 632,496 632,548 574,548 574,580 510,580 510,604 436,604 436,580 366,580 366,552 310,552 310,512 278,512 278,436 294,436 294,352 316,352 316,276 342,276 342,200 370,200 370,128 400,128"
          />
          <polygon
            class="land"
            points="392,64 544,64 544,92 592,92 592,144 632,144 632,216 668,216 668,308 696,308 696,420 668,420 668,484 624,484 624,536 566,536 566,568 502,568 502,592 428,592 428,568 358,568 358,540 302,540 302,500 270,500 270,424 286,424 286,340 308,340 308,264 334,264 334,188 362,188 362,116 392,116"
          />

          <g class="terrain terrain--mountain">
            <rect x="520" y="128" width="32" height="32" />
            <rect x="552" y="160" width="32" height="32" />
            <rect x="570" y="226" width="34" height="34" />
            <rect x="596" y="290" width="34" height="34" />
            <rect x="606" y="360" width="34" height="34" />
            <rect x="550" y="420" width="32" height="32" />
          </g>
          <g class="terrain terrain--forest">
            <rect x="374" y="234" width="28" height="28" />
            <rect x="416" y="276" width="28" height="28" />
            <rect x="350" y="356" width="28" height="28" />
            <rect x="432" y="420" width="28" height="28" />
            <rect x="490" y="482" width="28" height="28" />
          </g>
          <g class="terrain terrain--field">
            <rect x="386" y="326" width="42" height="26" />
            <rect x="330" y="456" width="42" height="26" />
            <rect x="510" y="350" width="42" height="26" />
          </g>

          <rect class="island-shadow" x="322" y="646" width="178" height="48" />
          <rect class="island" x="312" y="636" width="178" height="48" />
          <rect class="island-detail" x="354" y="624" width="88" height="16" />
          <rect class="island-detail" x="370" y="680" width="70" height="12" />
          <rect class="small-island" x="192" y="426" width="22" height="22" />
          <rect class="small-island" x="224" y="470" width="14" height="14" />
        </svg>

        <div class="marker-layer">
          <CityMarker
            v-for="city in weatherList"
            :key="city.id"
            :city-item="city"
            :city-name="cityNames[city.id] || city.name || city.id"
            :selected="city.id === selectedCityId"
            @select-city="selectCity"
          />
        </div>
      </div>

      <div v-if="loading" class="map-loading" role="status">
        <span class="map-loading__blocks" aria-hidden="true">▰ ▰ ▰</span>
        <span>{{ labels.loadingMap || 'LOADING WEATHER...' }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.weather-game-map {
  display: grid;
  gap: 10px;
}

.map-viewport {
  position: relative;
  overflow: hidden;
  min-height: clamp(430px, 64vh, 700px);
  background: #2f6574;
  border: 4px solid #101c24;
  box-shadow:
    inset 0 0 0 3px #6f9292,
    inset 0 0 34px rgb(4 17 22 / 65%);
  cursor: grab;
  outline: none;
  touch-action: none;
  user-select: none;
}

.map-viewport--dragging {
  cursor: grabbing;
}

.map-world {
  position: absolute;
  inset: 0;
  transform-origin: center;
  transition: transform 120ms steps(3, end);
  will-change: transform;
}

.map-viewport--dragging .map-world {
  transition: none;
}

.korea-pixel-map,
.marker-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.korea-pixel-map {
  image-rendering: pixelated;
}

.land-shadow {
  fill: #1c362b;
}

.land {
  fill: url(#land-grid);
  stroke: #263e29;
  stroke-width: 10;
  stroke-linejoin: miter;
}

.terrain--mountain {
  fill: #6d6042;
  stroke: #3f3828;
  stroke-width: 6;
}

.terrain--forest {
  fill: #356b40;
  stroke: #21462d;
  stroke-width: 5;
}

.terrain--field {
  fill: #bdad5d;
  stroke: #6d6237;
  stroke-width: 5;
}

.island-shadow {
  fill: #1c362b;
}

.island {
  fill: #71984f;
  stroke: #263e29;
  stroke-width: 9;
}

.island-detail {
  fill: #54753e;
}

.small-island {
  fill: #71984f;
  stroke: #263e29;
  stroke-width: 5;
}

.marker-layer {
  z-index: 2;
  pointer-events: none;
}

.map-loading {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 10px;
  color: #f8edba;
  background: rgb(13 27 35 / 78%);
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  letter-spacing: 0.08em;
}

.map-loading__blocks {
  color: #b5dd68;
  animation: loading-blink 800ms steps(2, end) infinite;
}

@keyframes loading-blink {
  50% {
    opacity: 0.35;
  }
}

@media (max-width: 620px) {
  .map-viewport {
    min-height: 470px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .map-world {
    transition: none;
  }

  .map-loading__blocks {
    animation: none;
  }
}
</style>
