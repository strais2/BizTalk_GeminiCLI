// API 베이스 URL (동일 도메인에서 서빙하므로 상대 경로 사용)
const API_BASE = ""; 

// 수신 대상 버튼 토글 로직
const targetButtons = document.querySelectorAll('.target-btn');
targetButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 기존 active 제거
        targetButtons.forEach(btn => btn.classList.remove('active'));
        // 클릭한 버튼 active 추가
        button.classList.add('active');
    });
});

/**
 * 말투 변환 API 호출
 */
async function convertTone() {
    const inputText = document.getElementById("inputText").value.trim();
    const activeBtn = document.querySelector(".target-btn.active");
    const target = activeBtn ? activeBtn.dataset.target : null;

    if (!inputText) {
        alert("변환할 내용을 입력해주세요.");
        return;
    }

    if (!target) {
        alert("수신 대상을 선택해주세요.");
        return;
    }

    // 로딩 상태 표시
    setLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/api/convert`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: inputText,
                target_audience: target
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "변환 중 오류가 발생했습니다.");
        }

        const data = await response.json();
        
        // 결과 출력
        const outputContainer = document.getElementById("outputContainer");
        const outputText = document.getElementById("outputText");
        
        outputText.value = data.converted_text;
        outputContainer.style.display = "block";
        
        // 결과 영역으로 스크롤
        outputContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Conversion Error:", error);
        alert(`오류 발생: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

/**
 * 로딩 상태 UI 제어
 */
function setLoading(isLoading) {
    const convertBtn = document.getElementById("convertBtn");
    const loader = document.getElementById("loader");
    const outputContainer = document.getElementById("outputContainer");

    if (isLoading) {
        convertBtn.disabled = true;
        loader.style.display = "block";
        outputContainer.style.display = "none";
    } else {
        convertBtn.disabled = false;
        loader.style.display = "none";
    }
}

/**
 * 클립보드 복사 기능
 */
function copyToClipboard() {
    const outputText = document.getElementById("outputText");
    const copyBtn = document.getElementById("copyBtn");

    outputText.select();
    outputText.setSelectionRange(0, 99999); // 모바일 대응

    try {
        navigator.clipboard.writeText(outputText.value);
        
        // 버튼 텍스트 변경 피드백
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "✅ 복사 완료!";
        copyBtn.style.backgroundColor = "#059669";
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.backgroundColor = "";
        }, 2000);
    } catch (err) {
        alert("복사에 실패했습니다.");
    }
}
