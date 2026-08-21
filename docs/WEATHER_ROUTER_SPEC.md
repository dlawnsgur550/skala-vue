# 날씨 Router 과제 실행 명세서

## 1. 목표

기존 날씨 컴포넌트 실습을 Vue Router 기반 페이지 구조로 확장한다. 검색, 기온·습도 기준, 카드 선택 기능은 유지하고 상세보기는 `window.alert()` 대신 도시별 URL로 이동한다.

## 2. Route 규칙

| URL | Route 이름 | View | 로딩 방식 |
|---|---|---|---|
| `/` | `WeatherHome` | `WeatherHomeView.vue` | 일반 import |
| `/about` | `WeatherAbout` | `WeatherAboutView.vue` | Lazy Loading |
| `/criteria` | `HeatCriteria` | `HeatCriteriaView.vue` | Lazy Loading |
| `/weather/:cityId` | `WeatherDetail` | `WeatherDetailView.vue` | Lazy Loading |
| `/:pathMatch(.*)*` | `NotFound` | `NotFoundView.vue` | Lazy Loading |

## 3. 파일 역할

- `src/main.js`: Router 인스턴스를 `app.use(router)`로 Vue 앱에 등록한다.
- `src/App.vue`: 공통 제목, `RouterLink` Navigation Bar, `RouterView`를 배치한다.
- `src/router/index.js`: URL과 View의 대응 규칙을 정의한다.
- `src/views/WeatherHomeView.vue`: 기존 `WeatherParent`의 날씨 대시보드 기능을 Router의 `/` 페이지로 제공한다.
- `src/views/WeatherDetailView.vue`: `route.params.cityId`에 맞는 Mock Data를 Mount 시점에 선택한다.
- `src/views/WeatherAboutView.vue`: 서비스 소개와 홈 이동 기능을 제공한다.
- `src/views/HeatCriteriaView.vue`: 본인만의 추가 View로 기온+습도 더위 기준을 설명한다.
- `src/views/NotFoundView.vue`: 정의하지 않은 URL을 처리한다.
- `src/components/exercise/WeatherCard.vue`: 상세보기 클릭 시 도시 ID를 `click-detail` 이벤트로 전달한다.

## 4. 핵심 흐름

### 상세보기

```text
WeatherCard 상세보기 클릭
→ emit('click-detail', cityId, cityName, status)
→ WeatherHomeView.goToDetail(cityId)
→ router.push('/weather/' + cityId)
→ WeatherDetailView Mount
→ route.params.cityId에 해당하는 Mock Data 출력
```

### 검색 Query String

```text
검색어 입력
→ searchQuery 변경
→ watch(searchQuery)
→ router.push({ name: 'WeatherHome', query: { search: 검색어 } })
→ 주소창에 /?search=검색어 표시
```

`/?search=광`으로 직접 접속하거나 새로고침하면 `onMounted()`가 Query String을 읽어 검색어를 복원한다.

## 5. 실행 방법

```bash
cd /Users/lim/workspace/skala-vue
npm run dev
```

터미널에 출력되는 `Local` 주소를 브라우저에서 연다. 기본 주소는 일반적으로 `http://localhost:5173`이다.

## 6. 검증 절차

1. `/`에서 여섯 도시 카드가 표시되는지 확인한다.
2. 검색창에 `광`을 입력해 광주와 광양만 남고 URL에 `?search=광`이 붙는지 확인한다.
3. 새로고침 후에도 `광` 검색이 유지되는지 확인한다.
4. 서울의 상세보기를 눌러 `/weather/city_01`로 이동하는지 확인한다.
5. 상세정보에 서울, 28℃, 맑음, 55%, 2.5m/s가 표시되는지 확인한다.
6. 상세 페이지의 돌아가기 버튼이 `/`로 이동하는지 확인한다.
7. `/about`에서 서비스 소개가 표시되는지 확인한다.
8. `/criteria`에서 본인만의 더위 기준 View가 표시되는지 확인한다.
9. `/weather/unknown`에서 상세 데이터 없음 안내가 표시되는지 확인한다.
10. `/kk`에서 Not Found 화면이 표시되고 홈 버튼이 작동하는지 확인한다.

## 7. 요구사항 대응

| 과제 요구사항 | 구현 |
|---|---|
| Vue Router 설정 | `src/router/index.js` |
| Router Lazy Loading | Home을 제외한 모든 View를 동적 import |
| Catch-all Route | `/:pathMatch(.*)*` |
| App Navigation Bar | 세 개의 `RouterLink` |
| 메인 콘텐츠 영역 | `RouterView` |
| WeatherHomeView | 기존 날씨 대시보드 기능 이동 |
| alert 제거 및 Programmatic Navigation | `goToDetail()`의 `router.push()` |
| 동적 상세 페이지 | `/weather/:cityId`와 `route.params.cityId` |
| Mock Data Mount 선택 | `WeatherDetailView`의 `onMounted()` |
| 서비스 소개와 홈 이동 | `WeatherAboutView` |
| 본인 추가 View | `HeatCriteriaView`와 `/criteria` |
| 정의되지 않은 주소 처리 | `NotFoundView` |
