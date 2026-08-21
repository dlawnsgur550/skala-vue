# 생존 지도

Vue 수업에서 배운 기술로 만든 픽셀 게임형 한국·일본 날씨 지도입니다. 직접 제작한 지도에서 도시를 선택하면 인벤토리 Drawer가 열리고, 실제 날씨·5일 예보·대기질과 자체 지수인 **날씨 생존 난이도**를 확인할 수 있습니다.

공식 마인크래프트 이미지나 텍스처는 사용하지 않았습니다. UI와 지도는 코드로 직접 제작했고, 글꼴은 OFL-1.1인 Galmuri를 사용합니다.

## 주요 기능

- 드래그로 움직이는 한국·일본 픽셀 지도
- 지도 위 마우스 휠을 이용한 75~200% 확대·축소
- 한국 9개·일본 4개 도시 마커와 날씨 요약 Popover
- 검색 가능한 도시 Select와 `/weather/:cityId` 딥링크
- 오른쪽 인벤토리형 Drawer의 현재 날씨·5일 예보·AQI·PM10·PM2.5
- 섭씨·화씨, 일반·다크모드, 한국어·영어·일본어
- 모바일 390px부터 데스크톱까지 반응형 UI
- OpenWeather API 키를 브라우저에 노출하지 않는 Vercel 서버 함수

## 날씨 생존 난이도

공식 안전·의학 지수가 아닌 학습용 휴리스틱입니다.

```text
총점 = 기온 위험(최대 30)
     + 습도 위험(최대 15)
     + 시간 강수 위험(최대 20)
     + 풍속 위험(최대 15)
     + 유럽 AQI 위험(최대 20)
```

| 점수   | 등급 |
| ------ | ---- |
| 0~24   | 안전 |
| 25~49  | 주의 |
| 50~74  | 위험 |
| 75~100 | 극한 |

AQI 호출이 실패하거나 값이 없으면 부분 데이터만으로 안전을 추측하지 않고 **계산 불가**로 표시합니다. 자세한 기준은 `/criteria`에서 확인할 수 있습니다.

## 수업 기술이 연결된 실제 기능

| 기술              | 사용 위치                                                       |
| ----------------- | --------------------------------------------------------------- |
| `ref`, `reactive` | 로딩 상태, 갱신 시각, 지도 카메라, 도시별 상세 캐시             |
| `computed`        | 선택 도시, 번역 문구, 온도 변환, 생존 난이도                    |
| `watch`           | Router의 도시 ID를 감시해 Drawer 데이터 호출                    |
| `watchEffect`     | 선택 도시·언어에 맞춰 문서 제목 갱신                            |
| Props / Emits     | 지도→마커, 설정→부모, Drawer→부모 통신                          |
| Slot              | 공통 `GamePanel`의 header/content/footer 조립                   |
| Vue Router        | 지도·지수 설명·소개·404와 도시 Drawer 딥링크                    |
| Pinia             | 온도 단위, 화면 모드, 언어 전역 상태                            |
| Axios             | 현재 날씨·예보·대기질 서버 함수 호출                            |
| Element Plus      | Switch, Select, Button, Drawer, Card, Progress, Popover         |

## 데이터 흐름과 API 키 보호

```text
도시 마커 선택
  → Vue Router /weather/:cityId
  → Axios /api/weather, /api/forecast, /api/air-quality
  → Vercel Function이 서버 환경변수의 키로 외부 API 호출
  → Drawer와 computed 생존 난이도 갱신
```

브라우저 코드에는 OpenWeather 키를 넣지 않습니다. `VITE_` 환경변수도 클라이언트 번들에 포함되므로 사용하지 않습니다. 키는 로컬의 `.env.local`과 Vercel의 서버 환경변수에만 저장합니다.

## 프로젝트 구조

```text
skala-vue/
├── api/                          # Vercel 서버 함수와 OpenWeather 키 보호
│   ├── weather.js
│   ├── forecast.js
│   └── air-quality.js
├── src/
│   ├── components/
│   │   ├── game/                 # 현재 제출 화면의 지도·HUD·Drawer·지수
│   │   ├── exercise/             # 이전 종합 실습 컴포넌트
│   │   └── practices/            # 수업 시간의 개별 실습 기록
│   ├── data/                     # 도시 좌표와 한·영·일 문구
│   ├── router/                   # 페이지·도시 딥링크 규칙
│   ├── services/                 # Axios 호출과 응답 정규화
│   ├── stores/                   # 단위·테마·언어 Pinia Store
│   ├── views/                    # 지도·지수 설명·소개·404 화면
│   ├── App.vue                   # 공통 게임 프레임과 출처
│   └── main.js                   # Vue·Pinia·Router·Element Plus 등록
├── .env.example                  # 커밋 가능한 환경변수 이름 예시
├── vercel.json                   # Router 새로고침 처리
└── vite.config.js                # 로컬에서도 Vercel 함수와 같은 API 실행
```

## 로컬 실행

Node.js 20.19 이상이 필요합니다.

```sh
npm install
cp .env.example .env.local
```

`.env.local`에 본인의 키를 입력합니다.

```dotenv
OPENWEATHER_API_KEY=본인의_OpenWeather_API_Key
```

```sh
npm run dev
```

Vite가 Vue 화면과 `api/`의 로컬 서버 함수를 함께 실행합니다.

## Vercel 배포

1. GitHub 저장소에 이 프로젝트를 올립니다.
2. Vercel에서 저장소를 Import하고 Framework Preset을 `Vite`로 선택합니다.
3. **Settings → Environment Variables**에 `OPENWEATHER_API_KEY`를 등록합니다.
4. Production, Preview, Development 환경을 선택하고 배포합니다.

`.env.local`, `.vercel`, `dist`, `node_modules`는 `.gitignore`에 포함되어 있습니다.

## 주요 URL

| URL                | 화면                                  |
| ------------------ | ------------------------------------- |
| `/`                | 대한민국 픽셀 날씨 지도               |
| `/weather/:cityId` | 같은 지도 위 도시 인벤토리 Drawer     |
| `/criteria`        | 생존 난이도 공식과 AQI 안전 잠금 설명 |
| `/about`           | 프로젝트 기술·데이터 흐름 소개        |
| 정의되지 않은 주소 | 픽셀 404 화면                         |

## 검사

```sh
npm run lint
npm run build
```

## 출처와 라이선스

- Weather: [OpenWeather](https://openweathermap.org/)
- Air quality: [Open-Meteo](https://open-meteo.com/) 기반 CAMS ENSEMBLE
- Pixel font: [Galmuri](https://github.com/quiple/galmuri), SIL Open Font License 1.1
