<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import GamePanel from '../components/game/GamePanel.vue'
import { usePreferenceStore } from '../stores/preferenceStore'

const router = useRouter()
const preferenceStore = usePreferenceStore()

const copy = computed(() => {
  const copies = {
    ko: {
      title: '탐사 시스템 기록',
      intro:
        '수업에서 배운 Vue 기술을 실제 지도 조작과 날씨 데이터 흐름에 연결한 비상업용 학습 프로젝트입니다.',
      flow: [
        '도시 표식 선택',
        'Router 주소 동기화',
        'Axios 서버 함수 호출',
        'Drawer 인벤토리 출력',
      ],
      note: '지도와 UI는 직접 제작했으며 공식 게임 이미지·텍스처를 사용하지 않았습니다.',
      back: '탐사 시작',
    },
    en: {
      title: 'Expedition System Log',
      intro:
        'A non-commercial learning project connecting classroom Vue skills to map controls and live weather data.',
      flow: [
        'Select marker',
        'Sync Router URL',
        'Call server APIs with Axios',
        'Render inventory Drawer',
      ],
      note: 'The map and UI are original and use no official game images or textures.',
      back: 'Start expedition',
    },
    ja: {
      title: '探査システム記録',
      intro:
        '授業で学んだVue技術を地図操作と実際の気象データに結び付けた非商用学習プロジェクトです。',
      flow: [
        '都市マーカー選択',
        'Router URL同期',
        'AxiosでサーバーAPI呼出',
        'Drawerインベントリ表示',
      ],
      note: '地図とUIは独自制作で、公式ゲームの画像・テクスチャは使用していません。',
      back: '探査を開始',
    },
  }
  return copies[preferenceStore.language] ?? copies.ko
})

const techniques = [
  'ref / reactive',
  'computed',
  'watch / watchEffect',
  'Props / Emits',
  'Slot',
  'Vue Router',
  'Pinia',
  'Axios',
  'Element Plus',
]

const goHome = () => router.push({ name: 'WeatherHome' })
</script>

<template>
  <GamePanel class="system-log">
    <template #header>
      <span class="log-code">SYSTEM LOG / 03</span>
      <h2>{{ copy.title }}</h2>
    </template>

    <div class="log-content">
      <p class="log-intro">{{ copy.intro }}</p>

      <ol class="data-flow">
        <li v-for="(step, index) in copy.flow" :key="step">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <strong>{{ step }}</strong>
        </li>
      </ol>

      <div class="tech-rack" aria-label="Technology inventory">
        <span v-for="technique in techniques" :key="technique">{{ technique }}</span>
      </div>

      <p class="copyright-note">ⓘ {{ copy.note }}</p>
    </div>

    <template #footer>
      <el-button type="primary" class="log-button" @click="goHome">▶ {{ copy.back }}</el-button>
    </template>
  </GamePanel>
</template>

<style scoped>
.system-log h2 {
  margin: 3px 0 0;
  color: var(--pixel-ink-strong);
}

.log-code {
  color: var(--pixel-accent);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
}

.log-content {
  display: grid;
  gap: 18px;
  padding: clamp(16px, 4vw, 34px);
}

.log-intro,
.copyright-note {
  margin: 0;
  color: var(--pixel-muted);
}

.data-flow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.data-flow li {
  display: grid;
  min-height: 112px;
  align-content: space-between;
  gap: 14px;
  padding: 12px;
  background: var(--pixel-panel-deep);
  border: 3px solid var(--pixel-border-color);
  box-shadow: inset 0 0 0 2px var(--pixel-border-highlight);
}

.data-flow span {
  color: var(--pixel-warm);
}

.data-flow strong {
  color: var(--pixel-ink-strong);
  font-size: 0.82rem;
}

.tech-rack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px;
  background: #17292d;
  border: 3px solid var(--pixel-border-color);
}

.tech-rack span {
  padding: 5px 8px;
  color: #dff3a8;
  background: #355c3e;
  border: 2px solid #6d8d62;
  font-size: 0.7rem;
}

.copyright-note {
  padding: 12px;
  border-left: 4px solid var(--pixel-warm);
}

.log-button {
  border: 3px solid var(--pixel-border-color);
}

@media (max-width: 720px) {
  .data-flow {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 420px) {
  .data-flow {
    grid-template-columns: 1fr;
  }

  .data-flow li {
    min-height: 82px;
  }
}
</style>
