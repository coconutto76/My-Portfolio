# 송민서 — 포트폴리오

React + Vite로 만든 에디토리얼 무드의 포트폴리오 사이트입니다.

## 실행 방법

개발 서버 (수정하면서 미리 보기):

```bash
npm run dev
```

→ 터미널에 나온 `http://localhost:5173/` 주소를 브라우저에서 엽니다.

배포용 빌드:

```bash
npm run build
```

→ `dist/` 폴더가 만들어집니다. 빌드 결과 확인은 `npm run preview`.

## 폴더 구조

| 경로 | 설명 |
| --- | --- |
| `src/data.js` | 프로필·작품 등 **모든 예시 데이터**. 여기만 고치면 내용이 바뀝니다. |
| `src/App.jsx` | 전체 페이지 조립 (탭 상태, 상세 보기) |
| `src/components/` | 내비게이션, 카드, 상세 보기, 프로필 등 조각 컴포넌트 |
| `src/index.css` | 색·폰트·레이아웃 등 모든 스타일 |
| `public/images/` | 작품 이미지 파일 위치 |

## 이미지 넣는 법

1. 이미지 파일을 `public/images/` 폴더에 넣습니다.
2. `src/data.js`에서 해당 작품의 `image` 값을 `/images/파일이름.jpg` 로 맞춥니다.
3. 파일이 없으면 화면에 "이미지 자리" 표시가 나옵니다 (에러 아님).

현재 `work-dog.jpg`, `work-cat.jpg`, `work-daily.jpg` 3장은 Unsplash 무료 이미지입니다.

## 다음에 붙일 것 (예정)

- 로그인 / 작품 업로드 기능
- 실제 영상 파일 연결
