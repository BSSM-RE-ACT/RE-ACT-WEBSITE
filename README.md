# RE:ACT 동아리 웹사이트

부산소프트웨어마이스터고 리액트 개발 동아리 RE:ACT의 공식 웹사이트입니다.
공개 페이지는 소개/프로젝트/기술 스택/활동 연혁/부원/모집 정보를 보여주고,
`/admin`에서 로그인하면 모든 내용을 직접 수정할 수 있어요.

## 구조

- `frontend/` — React + TypeScript + Vite + Tailwind CSS
- `backend/` — FastAPI + SQLite, 관리자 인증(JWT) + 콘텐츠 CRUD API

## 실행 방법

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
     - `http://localhost:5173` (개발용)
     - 실제 배포 도메인 (예: `https://react-club.kr`)
4. 발급된 **Client ID**를 복사해서:
   - `backend/.env`의 `GOOGLE_CLIENT_ID=` 에 붙여넣기
   - `frontend/.env`(없으면 `frontend/.env.example`을 복사해서 생성)의 `VITE_GOOGLE_CLIENT_ID=` 에 붙여넣기
5. `backend/.env`의 `ADMIN_EMAILS=`에 처음 등록할 관리자 구글 이메일(쉼표로 여러 개 가능)을 넣고
   백엔드를 재시작하면 자동으로 관리자 목록에 추가돼요. 이후엔 root가 관리자 페이지에서 추가/삭제하면 됩니다.
6. 프론트/백엔드를 재시작하면 로그인 페이지에 "Sign in with Google" 버튼이 나타나요.

`GOOGLE_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID`를 비워두면 구글 버튼이 자동으로 숨겨지고 root 계정으로만
로그인할 수 있어요 — 설정 전에도 사이트는 정상 작동합니다.

## 방문자 통계

공개 사이트를 방문하면(탭당 1회) 방문 기록이 남고, 관리자 대시보드에서 오늘/전체 방문자 수와
7·30·90일 일별 그래프를 볼 수 있어요. `방문자 초기화`는 root만 가능합니다.

## 배포 시 참고사항

- `backend/.env`: `SECRET_KEY`, `ADMIN_PASSWORD`를 반드시 변경하고, `ALLOWED_ORIGINS`에 실제 프론트엔드 도메인을 추가하세요.
- `frontend/.env`: `VITE_API_URL`을 배포된 백엔드 주소로 설정하세요 (프론트/백엔드가 같은 도메인 뒤에 있지 않다면 필요).
- 구글 로그인을 쓸 거면 위 "구글 로그인 켜는 방법"을 따라 `GOOGLE_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID`를 설정하고,
  Authorized JavaScript origins에 배포 도메인을 추가하세요.
- 이미지 업로드 파일은 `backend/uploads/`에 저장됩니다. 서버를 재배포/이전할 때 함께 옮겨주세요.
- 데이터베이스는 SQLite 파일(`backend/react_club.db`)입니다. 정기적으로 백업하는 걸 추천해요.
