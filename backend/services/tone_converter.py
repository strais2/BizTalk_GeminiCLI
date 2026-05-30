import os
from dotenv import load_dotenv
from langchain_upstage import ChatUpstage
from langchain_core.prompts import ChatPromptTemplate
from prompts.templates import PROMPTS

# .env 파일 로드
load_dotenv()

class ToneConverter:
    def __init__(self):
        api_key = os.getenv("UPSTAGE_API_KEY")
        if not api_key:
            raise ValueError("UPSTAGE_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.")
        
        # ChatUpstage 초기화 (최신 Solar-Pro3 모델 사용)
        self.llm = ChatUpstage(model="solar-pro-3", api_key=api_key)

    async def convert(self, text: str, target_audience: str) -> str:
        # 대상에 맞는 시스템 프롬프트 선택
        system_message = PROMPTS.get(target_audience, PROMPTS["team"])
        
        # 프롬프트 템플릿 구성
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_message),
            ("human", "{input_text}")
        ])
        
        # 체인 생성 및 호출
        chain = prompt | self.llm
        
        try:
            response = await chain.ainvoke({"input_text": text})
            return response.content
        except Exception as e:
            print(f"Error during AI conversion: {e}")
            raise e
