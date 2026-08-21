<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import GamePanel from '../components/game/GamePanel.vue'
import { usePreferenceStore } from '../stores/preferenceStore'

const router = useRouter()
const preferenceStore = usePreferenceStore()

const pageCopy = computed(() => {
  const copies = {
    ko: {
      kicker: 'FIELD MANUAL / INDEX',
      title: '날씨 생존 난이도 계산서',
      intro: '기온·습도·강수·풍속·AQI의 위험 점수를 더해 0~100으로 표시하는 학습용 지수입니다.',
      formula: '총점 = 기온(30) + 습도(15) + 강수(20) + 풍속(15) + AQI(20)',
      factors: [
        ['기온', '10℃ 미만 또는 26℃ 초과일수록 증가', '최대 30'],
        ['습도', '26℃ 이상에서 55% 초과분 반영', '최대 15'],
        ['강수', '시간당 1·4·10mm 구간별 증가', '최대 20'],
        ['풍속', '4m/s 초과분을 단계적으로 반영', '최대 15'],
        ['AQI', '유럽 AQI의 1/5을 위험 점수로 반영', '최대 20'],
      ],
      guardTitle: '안전 잠금 규칙',
      guard:
        'AQI 호출이 실패하거나 값이 없으면 일부 항목만으로 추측하지 않고 “계산 불가”로 표시합니다.',
      back: '지도 화면으로 복귀',
    },
    en: {
      kicker: 'FIELD MANUAL / INDEX',
      title: 'Weather Survival Difficulty Formula',
      intro:
        'A learning index from 0–100 that adds risk from temperature, humidity, rain, wind, and AQI.',
      formula: 'Total = Temperature (30) + Humidity (15) + Rain (20) + Wind (15) + AQI (20)',
      factors: [
        ['Temperature', 'Rises below 10℃ or above 26℃', 'Max 30'],
        ['Humidity', 'Counts excess above 55% when at least 26℃', 'Max 15'],
        ['Rain', 'Rises at hourly 1, 4, and 10mm bands', 'Max 20'],
        ['Wind', 'Counts the portion above 4m/s', 'Max 15'],
        ['AQI', 'Uses one fifth of European AQI', 'Max 20'],
      ],
      guardTitle: 'Safety lock',
      guard:
        'If AQI fails or is missing, the app shows “Unavailable” instead of guessing from partial data.',
      back: 'Return to map',
    },
    ja: {
      kicker: 'FIELD MANUAL / INDEX',
      title: '天気サバイバル難易度の計算書',
      intro: '気温・湿度・降水・風速・AQIの危険点を合計し、0〜100で示す学習用指数です。',
      formula: '合計 = 気温(30) + 湿度(15) + 降水(20) + 風速(15) + AQI(20)',
      factors: [
        ['気温', '10℃未満または26℃超で上昇', '最大30'],
        ['湿度', '26℃以上で55%を超えた分を反映', '最大15'],
        ['降水', '1時間1・4・10mmの区分で上昇', '最大20'],
        ['風速', '4m/sを超えた分を反映', '最大15'],
        ['AQI', 'ヨーロッパAQIの5分の1を反映', '最大20'],
      ],
      guardTitle: '安全ロック規則',
      guard: 'AQI取得に失敗した場合は部分データで推測せず「計算不可」と表示します。',
      back: '地図画面へ戻る',
    },
  }

  return copies[preferenceStore.language] ?? copies.ko
})

const grades = computed(() => [
  { range: '0–24', name: preferenceStore.texts.game.gradeSafe, color: '#56a64b' },
  { range: '25–49', name: preferenceStore.texts.game.gradeCaution, color: '#d5a62f' },
  { range: '50–74', name: preferenceStore.texts.game.gradeDanger, color: '#d9633d' },
  { range: '75–100', name: preferenceStore.texts.game.gradeExtreme, color: '#a93f36' },
])

const goHome = () => router.push({ name: 'WeatherHome' })
</script>

<template>
  <GamePanel class="field-manual">
    <template #header>
      <span class="manual-kicker">{{ pageCopy.kicker }}</span>
      <h2>{{ pageCopy.title }}</h2>
    </template>

    <div class="manual-content">
      <p class="manual-intro">{{ pageCopy.intro }}</p>

      <el-card shadow="never" class="formula-card">
        <strong>{{ pageCopy.formula }}</strong>
        <small>※ {{ preferenceStore.texts.game.heuristic }}</small>
      </el-card>

      <div class="factor-grid">
        <article v-for="factor in pageCopy.factors" :key="factor[0]" class="factor-slot">
          <span>{{ factor[0] }}</span>
          <p>{{ factor[1] }}</p>
          <strong>{{ factor[2] }}</strong>
        </article>
      </div>

      <div class="grade-grid" aria-label="Survival difficulty grades">
        <div v-for="grade in grades" :key="grade.range" :style="{ '--grade-color': grade.color }">
          <strong>{{ grade.range }}</strong>
          <span>{{ grade.name }}</span>
        </div>
      </div>

      <aside class="safety-lock">
        <span aria-hidden="true">⚠</span>
        <div>
          <strong>{{ pageCopy.guardTitle }}</strong>
          <p>{{ pageCopy.guard }}</p>
        </div>
      </aside>
    </div>

    <template #footer>
      <el-button type="primary" class="manual-back" @click="goHome">
        ◀ {{ pageCopy.back }}
      </el-button>
    </template>
  </GamePanel>
</template>

<style scoped>
.field-manual h2 {
  margin: 3px 0 0;
  color: var(--pixel-ink-strong);
}

.manual-kicker {
  color: var(--pixel-accent);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
}

.manual-content {
  display: grid;
  gap: 14px;
  padding: 16px;
}

.manual-intro {
  margin: 0;
  color: var(--pixel-muted);
}

.formula-card {
  color: var(--pixel-ink-strong);
  background: var(--pixel-panel-deep);
  border: 3px solid var(--pixel-border-color);
}

.formula-card :deep(.el-card__body) {
  display: grid;
  gap: 9px;
}

.formula-card small {
  color: var(--pixel-muted);
}

.factor-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.factor-slot {
  display: grid;
  align-content: space-between;
  min-height: 150px;
  gap: 8px;
  padding: 11px;
  background: var(--pixel-panel-deep);
  border: 3px solid var(--pixel-border-color);
  box-shadow: inset 0 0 0 2px var(--pixel-border-highlight);
}

.factor-slot span {
  color: var(--pixel-warm);
}

.factor-slot p {
  margin: 0;
  color: var(--pixel-muted);
  font-size: 0.72rem;
}

.factor-slot strong {
  color: var(--pixel-accent);
}

.grade-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.grade-grid div {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 10px;
  color: #fff;
  background: var(--grade-color);
  border: 3px solid var(--pixel-border-color);
}

.safety-lock {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  color: #ffe7b6;
  background: #572d25;
  border: 3px solid #a65a45;
}

.safety-lock > span {
  font-size: 2rem;
}

.safety-lock p {
  margin: 4px 0 0;
}

.manual-back {
  border: 3px solid var(--pixel-border-color);
}

@media (max-width: 850px) {
  .factor-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .factor-grid,
  .grade-grid {
    grid-template-columns: 1fr;
  }

  .factor-slot {
    min-height: 0;
  }
}
</style>
