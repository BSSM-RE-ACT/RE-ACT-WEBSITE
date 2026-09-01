# RE:ACT 동아리 웹사이트

부산소프트웨어마이스터고 리액트 개발 동아리 RE:ACT의 공식 웹사이트입니다.
공개 페이지는 소개/프로젝트/기술 스택/활동 연혁/부원/모집 정보를 보여주고,
`/admin`에서 로그인하면 모든 내용을 직접 수정할 수 있어요.

## 구조

- `frontend/` — React + TypeScript + Vite + Tailwind CSS
- `backend/` — FastAPI, 관리자 인증(JWT) + 콘텐츠 CRUD API (로컬 개발은 SQLite, 도커 배포는 MySQL)
- `docker-compose.yml` — 배포용 (frontend / backend / MySQL 3개 컨테이너)

## 배포 (Docker, react.bssm.dev)

```bash
cp .env.example .env   # 값 채우기 (아래 참고)
docker compose up -d --build
```

네 컨테이너가 뜨고, 각각 호스트 포트로 열려요:

| 컨테이너 | 호스트 포트 | 내용 |
|---|---|---|
| `frontend` | **20260** | nginx가 정적 사이트를 서빙하고 `/api`, `/uploads`는 backend로 프록시함 (같은 오리진) |
| `backend` | **20261** | FastAPI 직접 접근용 (디버깅/헬스체크) |
| `db` | **20262** | MySQL 8 |
| `cloudflared` | (없음, 아웃바운드 전용) | react.bssm.dev ↔ frontend를 연결하는 Cloudflare Tunnel |

`.env`에 채워야 하는 값 (`.env.example` 참고):

- `SECRET_KEY` — JWT 서명 키, 랜덤 문자열로 (예: `openssl rand -hex 32`)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — root 계정
- `ALLOWED_ORIGINS` — 기본값 `https://react.bssm.dev`로 되어 있음
- `GOOGLE_CLIENT_ID` / `VITE_GOOGLE_CLIENT_ID` — 구글 로그인 쓸 거면 (아래 "구글 로그인 켜는 방법" 참고, JS origin에 `https://react.bssm.dev` 추가)
- `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` — DB 계정/비밀번호
- `CLOUDFLARE_TUNNEL_TOKEN` — 아래 "Cloudflare Tunnel로 도메인 연결하기" 참고

⚠️ **20262(MySQL) 포트는 외부에 그대로 노출돼요.** 서버 방화벽에서 20262는 필요한 IP만 열거나
아예 막아두는 걸 추천해요 (백엔드는 도커 내부망으로 `db:3306`에 붙기 때문에 굳이 호스트에 안 열어도
동작에는 지장 없어요 — 외부에서 직접 DB에 붙어야 할 때만 쓰세요).

콘텐츠/업로드 이미지는 `db_data`, `uploads_data` 도커 볼륨에 저장돼서 컨테이너를 내렸다 올려도 유지돼요.
코드를 바꾼 뒤엔 `docker compose up -d --build`로 다시 빌드/재기동하면 됩니다.

### Cloudflare Tunnel로 도메인 연결하기

서버 방화벽에 인바운드 포트를 열 필요 없이, `cloudflared` 컨테이너가 Cloudflare로 아웃바운드
연결만 맺어서 `react.bssm.dev` 요청을 `frontend` 컨테이너로 그대로 전달해요. TLS 인증서도
Cloudflare가 알아서 처리합니다. (bssm.dev 도메인이 이미 Cloudflare에 등록되어 있어야 해요 — 학교
인프라 관리자에게 Zero Trust 대시보드 접근 권한이 있는지 확인하세요.)

1. [Cloudflare Zero Trust 대시보드](https://one.dash.cloudflare.com/) → **Networks → Tunnels →
   Create a tunnel**
2. Connector 타입은 **Cloudflared** 선택, 터널 이름 입력 (예: `react-club`)
3. "Install and run a connector" 화면에서 Docker 탭을 보면 `cloudflared tunnel run --token
   eyJ...` 같은 명령어가 나와요. 그 `--token` 뒤의 긴 문자열만 복사해서 `.env`의
   `CLOUDFLARE_TUNNEL_TOKEN=`에 붙여넣으세요.
4. 같은 화면에서 **Public Hostname** 탭 → Add a public hostname
   - Subdomain: `react`, Domain: `bssm.dev` (합쳐서 `react.bssm.dev`)
   - Service Type: **HTTP**, URL: **`frontend:80`** (도커 서비스 이름 — `localhost`나 `20260`이
     아니라 `frontend:80`으로 적어야 해요. `cloudflared`가 같은 도커 네트워크 안에서 `frontend`
     컨테이너로 직접 붙기 때문이에요.)
5. `docker compose up -d --build` (또는 이미 떠 있다면 `docker compose up -d cloudflared`)

몇 초 안에 `https://react.bssm.dev`가 열려요. 터널이 안 붙으면 `docker compose logs cloudflared`로
확인하세요 — 대부분 토큰이 잘못 복사됐거나 아직 `.env`에 안 채워진 경우예요.

> Cloudflare Tunnel을 안 쓰고 싶다면 서버에 이미 있는 리버스 프록시(nginx/Caddy 등)로
> `react.bssm.dev → localhost:20260`을 연결하고 certbot 같은 걸로 인증서를 붙여도 돼요. 그 경우
> `docker-compose.yml`의 `cloudflared` 서비스는 지우거나 `CLOUDFLARE_TUNNEL_TOKEN`을 빈 채로 두면
> (재시작을 반복하긴 하지만) 다른 서비스에는 영향 없어요.

## 로컬 개발 (Docker 없이)

### 백엔드

```bash
cd backend
source .venv/bin/activate  # 이미 backend/.venv 로 생성되어 있음
uvicorn app.main:app --reload --port 8000
```

최초 실행 시 `.env`의 `ADMIN_USERNAME` / `ADMIN_PASSWORD`로 관리자 계정이 자동 생성되고,
기본 플레이스홀더 콘텐츠가 채워집니다. **`backend/.env`의 `SECRET_KEY`와 관리자 비밀번호는
실제 배포 전에 꼭 바꿔주세요.**

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173` 에서 공개 사이트를, `http://localhost:5173/admin/login` 에서
관리자 로그인을 확인할 수 있어요. (기본 admin 계정: `.env`의 `ADMIN_USERNAME`/`ADMIN_PASSWORD`)

개발 서버는 `/api`, `/uploads` 요청을 자동으로 `http://127.0.0.1:8000` 백엔드로 프록시합니다.

## 관리자 대시보드

로그인하면 방문자 통계(오늘/전체, 7·30·90일 일별 차트)가 먼저 보이고, 그 아래 탭으로 콘텐츠를 관리합니다.

- **프로필**: 동아리 이름, 한 줄 소개, Hero 마퀴 태그, About 소개글, 통계, 모집 정보(자격/방법/일정/링크), Contact 문구/링크
- **부원**: 이름, 역할, 기수, 소개, 사진, Github 링크
- **프로젝트**: 제목, 설명, 기술 태그, 썸네일, Github/Live 링크, Featured 여부
- **기술 스택**: 카테고리별 기술 목록
- **활동**: 제목, 기관, 기간, 역할, 설명, 링크
- **목표**: 목표 텍스트와 완료 여부 (진행률이 자동 계산돼요)
- **관리자 계정**: 구글 로그인이 허용된 이메일 목록 (root만 추가/삭제 가능)

모든 목록은 항목별로 위/아래 화살표로 순서를 바꿀 수 있어요.

## 로그인 방식: root 계정 + 구글 로그인

두 가지 방법으로 관리자 페이지에 들어갈 수 있어요.

1. **root 계정** (`.env`의 `ADMIN_USERNAME`/`ADMIN_PASSWORD`) — 아이디/비밀번호 로그인. 최초 설정과
   관리자 계정 목록 관리(추가/삭제)는 root만 할 수 있어요.
2. **구글 로그인** — `관리자 계정` 탭에서 root가 등록한 이메일만 구글 계정으로 로그인할 수 있어요.
   동아리 부원(임원진)을 추가하고 싶으면 root로 로그인 → `관리자 계정` 탭에서 그 사람의 구글 이메일을
   추가하면 됩니다.

### 구글 로그인 켜는 방법 (직접 하셔야 해요)

구글 OAuth Client ID는 여러분의 구글 계정으로 직접 발급받아야 해서 제가 대신 만들어드릴 수 없어요.
아래 순서대로 하시면 됩니다.

1. [Google Cloud Console](https://console.cloud.google.com/) → 새 프로젝트 생성 (또는 기존 프로젝트 선택)
2. **APIs & Services → OAuth consent screen**에서 앱 이름(예: RE:ACT 관리자), 지원 이메일 등 기본 정보 입력 후 저장
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** 선택
   - Application type: **Web application**
   - Authorized JavaScript origins에 개발/배포 주소 추가:
     - `http://localhost:5173` (로컬 개발용)
     - `https://react.bssm.dev` (실제 배포 도메인)
4. 발급된 **Client ID**를 복사해서:
   - Docker 배포: 루트 `.env`의 `GOOGLE_CLIENT_ID=`, `VITE_GOOGLE_CLIENT_ID=` 둘 다에 붙여넣기
   - 로컬 개발: `backend/.env`의 `GOOGLE_CLIENT_ID=`, `frontend/.env`(없으면 `.env.example` 복사)의 `VITE_GOOGLE_CLIENT_ID=`에 붙여넣기
5. `ADMIN_EMAILS=`에 처음 등록할 관리자 구글 이메일(쉼표로 여러 개 가능)을 넣고 백엔드를 재시작하면
   자동으로 관리자 목록에 추가돼요. 이후엔 root가 관리자 페이지의 `관리자 계정` 탭에서 추가/삭제하면 됩니다.
6. 재시작하면 로그인 페이지에 "Sign in with Google" 버튼이 나타나요.

`GOOGLE_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID`를 비워두면 구글 버튼이 자동으로 숨겨지고 root 계정으로만
로그인할 수 있어요 — 설정 전에도 사이트는 정상 작동합니다.

## 방문자 통계

공개 사이트를 방문하면(탭당 1회) 방문 기록이 남고, 관리자 대시보드에서 오늘/전체 방문자 수와
7·30·90일 일별 그래프를 볼 수 있어요. `방문자 초기화`는 root만 가능합니다.

## Docker 없이 직접 배포할 때 참고사항

(권장 배포 방법은 위 "배포 (Docker, react.bssm.dev)"예요. 컨테이너 없이 직접 서버에 올릴 때만 참고하세요.)

- `backend/.env`: `SECRET_KEY`, `ADMIN_PASSWORD`를 반드시 변경하고, `ALLOWED_ORIGINS`에 실제 프론트엔드 도메인을 추가하세요.
- `frontend/.env`: `VITE_API_URL`을 배포된 백엔드 주소로 설정하세요 (프론트/백엔드가 같은 도메인 뒤에 있지 않다면 필요).
- 이미지 업로드 파일은 `backend/uploads/`에 저장됩니다. 서버를 재배포/이전할 때 함께 옮겨주세요.
- 기본 `DATABASE_URL`은 SQLite 파일(`backend/react_club.db`)이에요. 정기적으로 백업하세요.
