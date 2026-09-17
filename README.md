# 송민서 — 포트폴리오

React + Vite로 만든 에디토리얼 무드의 포트폴리오 사이트입니다.
작품 데이터는 **Supabase**의 `projects` 표에서 최신순으로 읽어옵니다.

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

## Supabase 설정

### 1. 환경 변수 넣기

`.env.local` 파일을 열어 값을 채웁니다. (이 파일은 GitHub에 올라가지 않습니다)

| 변수 | 값 찾는 곳 |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 같은 화면의 Publishable(anon) key |
| `VITE_SUPABASE_STORAGE_BUCKET` | 작품 이미지를 올린 Storage 버킷 이름 |

> ⚠️ `service_role` / `secret` key 는 절대 넣지 마세요. `VITE_`로 시작하는 값은
> 브라우저에 그대로 노출됩니다. 실수로 넣으면 앱이 연결을 거부하고 경고를 띄웁니다.

**값을 고친 뒤에는 개발 서버를 껐다가 다시 켜야 적용됩니다.**

### 2. projects 표

이미 만들어져 있습니다. 구조는 다음과 같습니다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `uuid` | 기본키 |
| `title` | `text` | 작품 제목 |
| `description` | `text` | 설명 |
| `image_url` | `text` | Storage 경로. 예: `images/dog.jpg` |
| `video_url` | `text` | 값이 있으면 **영상** 탭, 없으면 **이미지** 탭 |
| `created_at` | `timestamptz` | 등록 시각 (최신순 정렬 기준) |

### 3. 권한 설정 (RLS + GRANT)

[`supabase/policies.sql`](supabase/policies.sql) 파일 전체를
Supabase → **SQL Editor** → **New query** 에 붙여넣고 **Run** 하세요.

- 읽기: 누구나 (로그인 없이도 포트폴리오가 보여야 하므로)
- 쓰기: **관리자 UID 한 명만** — INSERT / UPDATE / DELETE 마다 UID를 검사
- UPDATE는 `using`(기존 행) + `with check`(새 값) **둘 다** 검사
- Storage는 `portfolio-media` 버킷의 `images/`, `videos/` 폴더만 허용

> 이 SQL은 데이터를 지우지 않습니다. `DROP TABLE`/`DELETE`/`TRUNCATE`가 없습니다.

### 4. Storage 버킷

- 버킷 이름: `portfolio-media`, **Public** 으로 설정 (비공개면 이미지가 안 보입니다)
- `image_url` / `video_url` 에는 버킷 안의 경로만 넣습니다. 예: `images/dog.jpg`

## 관리자 로그인

페이지 맨 아래 **"관리자 로그인"** 을 누르고 관리자 계정으로 로그인하면
상단에 관리자 막대가 나타나고, 작품을 등록·수정·삭제할 수 있습니다.

- 비밀번호는 **로그인 폼에서만** 입력받습니다. 코드·`.env`·저장소에 저장하지 않습니다.
- `service_role` / `secret` 키는 사용하지 않습니다. 로그인한 사용자의 세션으로만 동작합니다.
- 관리자가 아닌 계정으로 로그인하면 즉시 로그아웃됩니다.
- 파일 업로드나 저장이 실패하면 **입력한 내용이 그대로 남습니다.** 이미 업로드된
  파일은 다시 올리지 않고 재시도합니다.

## 화면 상태

작품을 못 불러왔을 때 **예시 데이터로 가리지 않고** 상황을 그대로 알려줍니다.

| 상황 | 화면 문구 |
| --- | --- |
| 불러오는 중 | 작품을 불러오는 중입니다… |
| 등록된 작품 0건 | 아직 등록된 작품이 없습니다. |
| 설정 누락 | Supabase 설정이 아직 입력되지 않았습니다. |
| 연결/조회 실패 | 작품 데이터를 불러오지 못했습니다. + 실패 원인 |
| 비밀키 입력됨 | 보안 위험: 비밀키가 입력되어 연결을 중단했습니다. |

## 폴더 구조

| 경로 | 설명 |
| --- | --- |
| `src/lib/supabase.js` | Supabase 연결 모듈 (공개 키만 사용, 비밀키 차단) |
| `src/hooks/useProjects.js` | `projects` 표 조회 + 상태 관리 |
| `src/data.js` | 프로필·탭 목록 (작품 데이터는 여기 없음) |
| `src/App.jsx` | 전체 페이지 조립 (탭 상태, 상세 보기) |
| `src/components/` | 내비게이션, 카드, 상세 보기, 상태 안내 등 |
| `src/index.css` | 색·폰트·레이아웃 등 모든 스타일 |
| `public/images/` | 정적 이미지 (프로필 사진 등) |

## Vercel 배포 설정

| 항목 | 값 |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | *(비워 둠)* |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Vercel → Settings → Environment Variables 에도 위 3개 변수를 똑같이 등록해야
배포된 사이트에서 작품이 보입니다.

## 다음에 붙일 것 (예정)

- 로그인 / 작품 업로드 기능
- Pages 카테고리 (표에 `category` 컬럼 추가 필요)

---

## 단일 파일 포트폴리오 (`standalone/index.html`)

빌드 없이 **파일 하나로 도는** 새 포트폴리오입니다. 위의 React 앱과는 별개이며,
기존 앱은 그대로 남아 있습니다.

| 항목 | 내용 |
| --- | --- |
| 파일 | `standalone/index.html` (이것 하나만 있으면 됩니다) |
| 페이지 | Profile(첫 화면) · Games · Papers · Records + Create(관리자 전용) |
| 표 | `games`, `papers`, `records`, `profile` |
| Storage | `portfolio-media` 버킷의 `games/` `papers/` `records/` `videos/` `profile/image/` `resumes/` |

### 1. SQL 먼저 실행하기

Supabase 대시보드 → SQL Editor → New query 에 **`supabase/portfolio-v3.sql`** 전체를
붙여넣고 Run 합니다. 표를 만들고 권한을 설정합니다.

> 이 SQL 을 실행하기 전에는 화면에 `Could not find the table 'public.games'` 라고 나옵니다.
> 실행한 뒤 새로고침하면 사라집니다.

**읽기는 누구나, 쓰기는 관리자 한 명만** 가능합니다. 방문자에게는 Create 버튼도,
프로필 수정칸도 보이지 않고, 서버의 RLS 정책이 실제 쓰기를 막습니다.

### 2. 관리자 로그인

페이지 맨 아래 **Admin** 을 누르고 관리자 계정으로 로그인하면
사이드바에 **Create** 버튼이 생기고 등록·수정·삭제가 열립니다.

- 비밀번호는 로그인 화면에서만 입력받고 어디에도 저장하지 않습니다.
- 관리자가 아닌 계정으로 로그인하면 즉시 로그아웃됩니다.
- 저장이 실패하면 **입력한 내용이 그대로 남고**, 방금 올라간 파일만 지워집니다.

### 3. 설정값

파일 맨 위 `설정값` 블록 한 곳에만 주소와 키가 들어 있습니다. 다른 곳에는 없습니다.

| 상수 | 지금 값 | 할 일 |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | 실제 값 | — |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 실제 값 (공개용 키라 브라우저에 노출돼도 됩니다) | — |
| `VITE_YOUTUBE_CHANNEL_URL` | `https://www.youtube.com/` | 실제 채널 주소로 교체 |
| `VITE_INSTAGRAM_URL` | `https://www.instagram.com/` | 실제 주소로 교체 |
| `VITE_THREADS_URL` | `https://www.threads.net/` | 실제 주소로 교체 |
| `VITE_LOGO_SRC` | `./logo.png` | 로고 파일을 같은 폴더에 두면 자동으로 씁니다. 없으면 내장 TPC SVG 가 나옵니다. |

> `.env.local` 과 달리 이 파일에는 값이 직접 들어 있습니다. 빌드 과정이 없어서
> 환경 변수를 읽을 방법이 없기 때문입니다. **Publishable(anon) 키만** 넣어야 하며,
> `service_role` / `secret` 키를 넣으면 파일이 스스로 연결을 거부합니다.

### 4. 보는 방법 · 배포

로컬에서 보려면 `npm run dev` 후 <http://localhost:5173/standalone/index.html> 를 엽니다.
(`file://` 로 직접 열면 CDN 과 Supabase 호출이 막힐 수 있습니다.)

Vercel 에 올리는 두 가지 방법:

1. 지금 앱과 **같이** 올리기 — `standalone/index.html` 을 `public/standalone.html` 로
   복사하면 빌드 결과(`dist/`)에 그대로 들어가서 `배포주소/standalone.html` 로 열립니다.
   (`public/` 안의 파일은 Vite 가 손대지 않고 그대로 복사합니다)
2. 이 파일만 **따로** 올리기 — `standalone/` 폴더를 새 Vercel 프로젝트로 만들고
   Framework Preset 을 `Other`, Build Command 는 비워 둡니다.
