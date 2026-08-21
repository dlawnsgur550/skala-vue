import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { messages } from '../data/messages'

export const usePreferenceStore = defineStore('preference', () => {
  // state: 앱 전체가 함께 사용할 화면 모드와 언어
  const theme = ref('light')
  const language = ref('ko')

  // getters: state를 바탕으로 화면에서 바로 사용할 값을 만든다.
  const isDark = computed(() => theme.value === 'dark')
  const texts = computed(() => messages[language.value])
  const languageName = computed(() => {
    if (language.value === 'en') return 'English'
    if (language.value === 'ja') return '日本語'
    return '한국어'
  })

  // actions: 컴포넌트는 state를 직접 바꾸지 않고 이 함수를 호출한다.
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setLanguage = (newLanguage) => {
    if (newLanguage === 'ko' || newLanguage === 'en' || newLanguage === 'ja') {
      language.value = newLanguage
    }
  }

  return { theme, language, isDark, texts, languageName, toggleTheme, setLanguage }
})
