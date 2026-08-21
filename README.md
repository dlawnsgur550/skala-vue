# SKALA Weather Dashboard

Vue 수업에서 배운 반응성, 디렉티브, 컴포넌트 통신, Router, Pinia에 Axios 실제 API 호출을 추가한 날씨 대시보드입니다.

## 주요 기능

- OpenWeather 현재 날씨를 이용한 6개 도시 실시간 조회
- OpenWeather 5일/3시간 예보를 이용한 도시별 5일 예보
- Open-Meteo Air Quality API를 이용한 유럽 AQI·PM10·PM2.5 표시
- 도시 이름 실시간 검색 및 URL Query String 동기화
- 기온과 습도를 함께 사용하는 더위 기준
- Vue Router를 이용한 메인·소개·상세·404 화면 전환
- Pinia를 이용한 섭씨·화씨, 일반·다크모드, 한국어·영어·일본어 설정

## API 키를 숨기는 구조

```text
브라우저(Vue + Axios)
        │  /api/weather, /api/forecast
        ▼
Vercel Function
        │  OPENWEATHER_API_KEY를 서버에서만 읽음
        ▼
OpenWeather API
```

브라우저 코드에는 API 키를 넣지 않습니다. `VITE_`로 시작하는 환경변수도 브라우저 번들에 포함되므로 사용하지 않습니다. OpenWeather 키는 로컬의 `.env.local`과 Vercel 서버 환경변수에만 저장합니다.

## 사용 기술과 데이터 출처

- Vue 3 Composition API, Vue Router, Pinia, Vite
- Axios
- OpenWeather Current Weather API
- OpenWeather 5 Day / 3 Hour Forecast API
- Open-Meteo Air Quality API
- Vercel Functions

## 프로젝트 구조

```text
skala-vue/
├── api/                          # Vercel 서버 함수(API 키 보호)
│   ├── weather.js                # OpenWeather 현재 날씨 프록시
│   ├── forecast.js               # OpenWeather 5일 예보 프록시
│   └── air-quality.js            # Open-Meteo 대기질 프록시
├── docs/                         # 과제 명세와 설명 문서
├── public/                       # 정적 파일
├── src/
│   ├── assets/                   # 앱 전체 CSS
│   ├── components/
│   │   ├── exercise/             # 현재 과제용 컴포넌트
│   │   └── practices/            # 이전 수업 실습 기록
│   ├── data/
│   │   ├── messages.js           # 한국어·영어·일본어 화면 문구
│   │   └── weatherData.js        # 도시 ID와 위도·경도
│   ├── router/                   # URL과 View 연결 규칙
│   ├── services/
│   │   └── weatherApi.js         # Axios 요청과 응답 데이터 정리
│   ├── stores/                   # 단위·화면 모드·언어 상태
│   ├── views/                    # Router가 표시하는 페이지
│   ├── App.vue                   # 전체 레이아웃과 데이터 출처 표기
│   └── main.js                   # Vue·Pinia·Router 시작 지점
├── .env.example                  # 환경변수 이름 예시(커밋 가능)
├── vercel.json                   # Vue Router 새로고침 경로 처리
└── package.json
```

## 로컬 실행

Node.js 20.19 이상이 필요합니다.

1. 패키지를 설치합니다.

```sh
npm install
```

2. 환경변수 예시를 복사하고 본인의 OpenWeather 키를 입력합니다.

```sh
cp .env.example .env.local
```

```dotenv
OPENWEATHER_API_KEY=본인의_OpenWeather_API_Key
```

3. Vue 화면과 로컬 API 서버를 함께 실행합니다.

```sh
npm run dev
```

Vite 개발 서버가 `api/`의 서버 함수를 로컬에서 함께 실행합니다. 브라우저에는 API 키가 전달되지 않고 `.env.local`의 키는 Node.js 개발 서버에서만 사용됩니다.

## Vercel 무료 배포

1. 이 프로젝트를 GitHub 저장소에 올립니다.
2. Vercel에서 저장소를 Import하고 Framework Preset을 `Vite`로 선택합니다.
3. Vercel 프로젝트의 **Settings → Environment Variables**에서 다음 값을 추가합니다.
   - Name: `OPENWEATHER_API_KEY`
   - Value: 본인의 OpenWeather API 키
   - Environments: Production, Preview, Development
4. Deploy 또는 Redeploy를 실행합니다.

`.env.local`은 `.gitignore`에 포함되어 GitHub와 Vercel 배포 파일에 올라가지 않습니다. 키가 변경되면 Vercel 환경변수를 수정한 뒤 다시 배포합니다.

## 검사와 빌드

```sh
npm run lint
npm run build
```

빌드 결과는 `dist/`에 생성됩니다.

## 주요 경로

| URL | 화면 |
| --- | --- |
| `/` | 실시간 날씨 대시보드 |
| `/about` | 서비스 소개 |
| `/criteria` | 더위 기준 설명 |
| `/weather/:cityId` | 현재 날씨·5일 예보·대기질 |
| 정의되지 않은 주소 | 404 안내 |

## 배포 전 확인

- `.env.local`이 Git에서 제외되는지 확인
- `npm run lint`와 `npm run build` 통과
- 메인에서 실시간 날씨·새로고침·검색 확인
- 상세에서 5일 예보·대기질·섭씨/화씨 변환 확인
- 일반/다크모드와 한국어/영어/일본어 확인
- 상세 URL을 직접 새로고침해도 화면이 열리는지 확인

날씨 데이터는 OpenWeather, 대기질 데이터는 Open-Meteo에서 제공합니다.
