<script setup>
const props = defineProps({
  zoom: {
    type: Number,
    required: true,
  },
  labels: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['move-map', 'update-zoom', 'reset-map'])

const moveMap = (direction) => {
  emit('move-map', direction)
}

const updateZoom = (value) => {
  emit('update-zoom', Number(value))
}
</script>

<template>
  <div class="map-controls" :aria-label="labels.mapTitle || '지도 조작 도구'">
    <div class="map-controls__dpad" :aria-label="labels.mapTitle || '지도 이동'">
      <el-button
        class="dpad-button dpad-button--up"
        :aria-label="labels.moveUp || '지도를 위로 이동'"
        @click="moveMap('up')"
      >
        ▲
      </el-button>
      <el-button
        class="dpad-button dpad-button--left"
        :aria-label="labels.moveLeft || '지도를 왼쪽으로 이동'"
        @click="moveMap('left')"
      >
        ◀
      </el-button>
      <el-button
        class="dpad-button dpad-button--reset"
        :aria-label="labels.resetMap || '지도 위치와 확대 비율 초기화'"
        @click="emit('reset-map')"
      >
        ◎
      </el-button>
      <el-button
        class="dpad-button dpad-button--right"
        :aria-label="labels.moveRight || '지도를 오른쪽으로 이동'"
        @click="moveMap('right')"
      >
        ▶
      </el-button>
      <el-button
        class="dpad-button dpad-button--down"
        :aria-label="labels.moveDown || '지도를 아래로 이동'"
        @click="moveMap('down')"
      >
        ▼
      </el-button>
    </div>

    <div class="map-controls__zoom">
      <label for="map-zoom-slider">
        {{ labels.zoom || 'ZOOM' }} {{ Math.round(props.zoom * 100) }}%
      </label>
      <el-slider
        id="map-zoom-slider"
        :model-value="props.zoom"
        :min="0.75"
        :max="2"
        :step="0.05"
        :show-tooltip="false"
        :aria-label="labels.zoom || '지도 확대 비율'"
        @input="updateZoom"
      />
    </div>
  </div>
</template>

<style scoped>
.map-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 10px;
  color: #edf7d2;
  background: rgb(20 34 43 / 92%);
  border: 3px solid #0b151c;
  box-shadow: inset 0 0 0 2px #526b72;
}

.map-controls__dpad {
  display: grid;
  grid-template-columns: repeat(3, 34px);
  grid-template-rows: repeat(3, 30px);
  gap: 2px;
}

.dpad-button {
  width: 34px;
  min-width: 0;
  height: 30px;
  margin: 0 !important;
  padding: 0;
  color: #f7f2d0;
  background: #425966;
  border: 2px solid #101b22;
  border-radius: 0;
  box-shadow:
    inset 2px 2px 0 #738995,
    inset -2px -2px 0 #253640;
  font-family: inherit;
}

.dpad-button:hover,
.dpad-button:focus-visible {
  color: #19261b;
  background: #b8de70;
  border-color: #e2f6a3;
}

.dpad-button--up {
  grid-area: 1 / 2;
}

.dpad-button--left {
  grid-area: 2 / 1;
}

.dpad-button--reset {
  grid-area: 2 / 2;
}

.dpad-button--right {
  grid-area: 2 / 3;
}

.dpad-button--down {
  grid-area: 3 / 2;
}

.map-controls__zoom {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(86px, auto) minmax(130px, 260px);
  align-items: center;
  justify-content: end;
  gap: 12px;
  min-width: 210px;
  font-size: 0.78rem;
}

.map-controls__zoom :deep(.el-slider__runway) {
  height: 10px;
  background: #1a2932;
  border: 2px solid #0b151c;
  border-radius: 0;
}

.map-controls__zoom :deep(.el-slider__bar) {
  height: 6px;
  background: #94c957;
  border-radius: 0;
}

.map-controls__zoom :deep(.el-slider__button) {
  width: 17px;
  height: 22px;
  background: #f7d356;
  border: 3px solid #5d411e;
  border-radius: 0;
  box-shadow: inset 2px 2px 0 #fff1a0;
}

@media (max-width: 620px) {
  .map-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .map-controls__dpad {
    align-self: center;
  }

  .map-controls__zoom {
    grid-template-columns: 84px minmax(120px, 1fr);
    min-width: 0;
  }
}
</style>
