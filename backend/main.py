import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routers import convert

app = FastAPI(title="업무 말투 변환기 API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포 시 특정 도메인으로 제한 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(convert.router, prefix="/api")

# 헬스체크 엔드포인트
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# 프론트엔드 정적 파일 서빙
# frontend 디렉토리가 존재하는 경우, 루트(/) 경로에서 직접 서빙
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    # html=True 옵션으로 index.html 자동 서빙 및 상대 경로(css/..., js/...) 지원
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
else:
    @app.get("/")
    async def read_root():
        return {"message": "Frontend directory not found. Please check the project structure."}
