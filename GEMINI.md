# GEMINI.md - 업무 말투 변환기 (BizTalk Gemini-CLI)

이 파일은 `biztalk-gemini-cli` 프로젝트의 아키텍처, 개발 컨벤션 및 워크플로우를 정의하는 가이드라인입니다. 모든 상호작용은 이 지침을 최우선으로 따릅니다.

## 1. 프로젝트 개요
- **목적**: 사용자가 입력한 일상적인 말투를 상사, 동료, 고객 등 수신 대상에 적합한 비즈니스 말투로 자동 변환하는 AI 서비스.
- **핵심 가치**: "완벽한 서비스"보다 "작동하는 서비스"를 지향하며, 바이브 코딩(Vibe Coding) 원칙을 준수함.
- **주요 기술 스택**:
  - **Backend**: Python 3.11+, FastAPI, Uvicorn
  - **AI**: Upstage Solar-Pro3, LangChain (langchain-upstage)
  - **Frontend**: Vanilla HTML/CSS/JS (프레임워크 없음)
  - **Deployment**: Vercel

## 2. 바이브 코딩 3원칙 (Mandatory)
본 프로젝트는 아래 3원칙을 엄격히 준수합니다.

1.  **완료 기준을 먼저 정의하라**: 구현 시작 전 체크리스트를 통해 "무엇을 만들면 끝인지" 명확히 정의합니다.
2.  **조사 먼저, 구현 나중**: 외부 API(Upstage)나 라이브러리 사용 전 연동 방식과 패키지 버전을 반드시 먼저 확인합니다. (`context7` 도구 활용 권장)
3.  **버그는 분석 먼저, 수정 나중**: 에러 발생 시 원인을 먼저 분석하고 설명한 뒤 수정을 진행합니다. 임의의 코드 수정을 지양합니다.

## 3. 디렉토리 구조 (Target)
현재 프로젝트는 아래 구조를 목표로 구현 중입니다.
```
biztalk-gemini-cli/
├── backend/
│   ├── main.py                 # FastAPI 진입점 및 CORS 설정
│   ├── routers/                # API 라우터 (convert.py 등)
│   ├── services/               # 비즈니스 로직 (AI 연동 등)
│   ├── prompts/                # 대상별 프롬프트 템플릿
│   ├── models/                 # Pydantic 스키마
│   └── requirements.txt        # 백엔드 의존성
├── frontend/
│   ├── index.html              # 메인 UI
│   ├── css/                    # 스타일시트
│   └── js/                     # 클라이언트 로직
├── .env                        # API 키 관리 (UPSTAGE_API_KEY)
└── PRD_업무말투변환기.md       # 제품 요구사항 명세서
```

## 4. 실행 및 개발 가이드

### 백엔드 실행
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 프론트엔드 실행
- `frontend/index.html`을 브라우저에서 직접 열거나 VS Code Live Server 등을 사용합니다.

### 주요 API 엔드포인트
- `POST /api/convert`: 말투 변환 요청
  - Payload: `{ "text": string, "target_audience": "boss" | "colleague" | "client" | "team" }`
- `GET /health`: 서버 상태 확인

## 5. 개발 컨벤션
- **언어**: 응답 및 주석은 한국어를 기본으로 합니다.
- **보안**: `.env` 파일 및 API 키는 절대 커밋하지 않으며, `.gitignore`에 등록되어 있는지 수시로 확인합니다.
- **에러 핸들링**: FastAPI의 HTTPException을 사용하여 명확한 에러 메시지와 상태 코드를 반환합니다.
- **프롬프트 전략**: `prompts/templates.py`에서 수신 대상별 시스템 프롬프트를 관리하며, 각 상황에 특화된 어조를 유지합니다.

## 6. 참고 문서
- [개요서_업무말투변환기.md](./개요서_업무말투변환기.md)
- [PRD_업무말투변환기.md](./PRD_업무말투변환기.md)

---
### @PRD_업무말투변환기.md 문서와 GEMINI.md 문서 항상 최신화 하기
* 모든 변경사항이 발생하면 (예를 들어 Source Code가 변경 되거나 라이브러리 버전이 변경되면) md 문서도 반드시 업데이트 합니다. 
* 구현이 완료된 사항들은 `2. 완료 체크리스트`에 모두 체크표시를 해서 완료 되었음을 반드시 표시하세요.
* `8. 단계별 구현 순서` 에서도 STEP별로 구현이 완료되면 체크표시를 해서 완료 되었음을 반드시 표시하세요
