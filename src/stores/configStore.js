import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // state: 원본 날씨 데이터는 섭씨로 유지하고, 화면에 표시할 단위만 저장한다.
  const unit = ref('celsius')

  // getter: 현재 단위에 알맞은 기호를 계산한다.
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // action: 섭씨와 화씨를 서로 바꾼다.
  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
