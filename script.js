document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        "H": "수소", "He": "헬륨", "Li": "리튬", "Be": "베릴륨", "B": "붕소",
        "C": "탄소", "N": "질소", "O": "산소", "F": "플루오린", "Ne": "네온",
        "Na": "나트륨(소듐)", "Mg": "마그네슘", "Al": "알루미늄", "Si": "규소", "P": "인",
        "S": "황", "Cl": "염소", "Ar": "아르곤", "K": "칼륨(포타슘)", "Ca": "칼슘",
        "Fe": "철", "Cu": "구리", "Zn": "아연", "Ag": "은", "Au": "금",
        "I": "아이오딘", "Pb": "납", "Hg": "수은", "Mn": "망가니즈", "Ba": "바륨"
    };

    const alternativeNames = {
        "Na": ["나트륨", "소듐"],
        "K": ["칼륨", "포타슘"]
    };

    let shuffledElements = [];
    let currentIndex = 0;
    let currentQuestion = {};
    let currentQuestionType = ""; // 각 문제의 유형
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let answered = false;
    let attempt = 0;
    let resultRecorded = false;  // 각 문제별 결과 기록 여부
    let resultDetails = [];      // 문제 결과 전체 기록
    let currentAttempts = [];    // 현재 문제의 모든 시도 기록

    // 화면 요소들
    const startScreen = document.getElementById("startScreen");
    const typeSelectionScreen = document.getElementById("typeSelectionScreen");
    const quizScreen = document.getElementById("quizScreen");
    const finalScreen = document.getElementById("finalScreen");
    const finalScoreDisplay = document.getElementById("finalScore");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const analysisDetails = document.getElementById("analysisDetails");
    const restartQuizFinal = document.getElementById("restartQuizFinal");

    // 유형 선택 관련 요소
    const quizTypeSelect = document.getElementById("quizType");
    const confirmTypeBtn = document.getElementById("confirmType");

    // 퀴즈 화면 관련 요소
    const startQuizBtn = document.getElementById("startQuiz");
    const questionDisplay = document.getElementById("question");
    const userInput = document.getElementById("userInput");
    const submitBtn = document.getElementById("submit");
    const nextBtn = document.getElementById("next");
    const revealBtn = document.getElementById("reveal");
    const stopBtn = document.getElementById("stop");
    const resultDisplay = document.getElementById("result");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const progressDisplay = document.getElementById("progressDisplay");

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function initializeQuiz() {
        shuffledElements = shuffleArray(Object.keys(elements));
        currentIndex = 0;
        score = 0;
        correctCount = 0;
        incorrectCount = 0;
        resultDetails = [];
        updateScoreDisplay();
        updateProgressDisplay();
        generateQuestion();
    }

    // 기존 로직 그대로: 각 문제에 해당하는 원소 하나씩 제공
    function getNextElement() {
        const symbol = shuffledElements[currentIndex];
        currentIndex++;
        return { symbol: symbol, name: elements[symbol] };
    }

    // 점수 업데이트
    function updateScoreDisplay() {
        scoreDisplay.textContent = `점수: ${score} | 정답 개수: ${correctCount} | 오답 개수: ${incorrectCount}`;
    }

    // 진행률 업데이트 (문제 번호 및 남은 문제 표시)
    function updateProgressDisplay() {
        const totalQuestions = shuffledElements.length;
        const solved = currentIndex;
        const remaining = totalQuestions - solved;
        progressDisplay.textContent = `문제: ${solved}/${totalQuestions} (남은 문제: ${remaining})`;
    }

    // 30문제 모두 풀렸으면 최종 결과 화면 표시
    function generateQuestion() {
        if (currentIndex >= shuffledElements.length) {
            showFinalScreen();
            return;
        }
        answered = false;
        attempt = 0;
        resultRecorded = false;
        currentAttempts = []; // 새로운 문제마다 시도 기록 초기화
        revealBtn.style.display = "none";
        resultDisplay.classList.remove("blinking", "blinking2");
        let type = quizTypeSelect.value;
        // mixed 모드인 경우 각 문제마다 랜덤으로 유형 선택
        if (type === "mixed") {
            const types = ["symbolToName", "nameToSymbol"];
            currentQuestionType = types[Math.floor(Math.random() * types.length)];
        } else {
            currentQuestionType = type;
        }
        currentQuestion = getNextElement();
        if (currentQuestionType === "symbolToName") {
            questionDisplay.textContent = `원소 기호: ${currentQuestion.symbol}`;
        } else if (currentQuestionType === "nameToSymbol") {
            questionDisplay.textContent = `원소 이름: ${currentQuestion.name}`;
        }
        resultDisplay.textContent = "";
        nextBtn.style.display = "none";
        userInput.value = "";
        updateProgressDisplay();
    }

    function checkAnswer() {
        if (answered) return;
        const answer = userInput.value.trim();
        if (!answer) return;
        // 현재 문제의 시도 기록에 추가
        currentAttempts.push(answer);
        let correctAnswer = "";
        if (currentQuestionType === "symbolToName") {
            if (alternativeNames[currentQuestion.symbol]) {
                const possibleAnswers = alternativeNames[currentQuestion.symbol];
                if (possibleAnswers.includes(answer)) {
                    correctAnswer = answer;
                }
            } else {
                correctAnswer = currentQuestion.name;
            }
        } else if (currentQuestionType === "nameToSymbol") {
            correctAnswer = currentQuestion.symbol;
        }
        // 질문이 종료될 때(정답을 맞추거나 공개할 때) 결과 기록 시,
        // "correct" 필드는 **첫 번째 시도**가 올바른지 여부로 결정
        if (answer === correctAnswer) {
            if (!resultRecorded) {
                resultDetails.push({
                    symbol: currentQuestion.symbol,
                    name: currentQuestion.name,
                    questionType: currentQuestionType,
                    attempts: currentAttempts.slice(),
                    correct: currentAttempts[0] === correctAnswer
                });
                resultRecorded = true;
            }
            if (attempt >= 1) {
                resultDisplay.classList.add("blinking2");
                resultDisplay.textContent = "이번에는 정답입니다!";
            } else {
                score += 2;
                correctCount++;
                resultDisplay.textContent = "정답입니다!";
            }
            resultDisplay.classList.remove("blinking");
            answered = true;
            nextBtn.style.display = "inline-block";
            revealBtn.style.display = "none";
        } else {
            score--;
            attempt++;
            incorrectCount++;
            revealBtn.style.display = "inline-block";
            resultDisplay.textContent = "오답입니다. 다시 입력하세요.";
            if (attempt >= 2) {
                score++;
                incorrectCount--;
                resultDisplay.classList.add("blinking");
            }
        }
        updateScoreDisplay();
    }

    function revealAnswer() {
        resultDisplay.textContent = `정답: ${currentQuestion.symbol} (${currentQuestion.name})`;
        resultDisplay.classList.remove("blinking");
        answered = true;
        revealBtn.style.display = "none";
        nextBtn.style.display = "inline-block";
        // 사용자가 한 번도 입력하지 않은 경우
        if (!currentAttempts.length) {
            currentAttempts.push("(입력 없음)");
        }
        if (!resultRecorded) {
            resultDetails.push({
                symbol: currentQuestion.symbol,
                name: currentQuestion.name,
                questionType: currentQuestionType,
                attempts: currentAttempts.slice(),
                correct: currentAttempts[0] === (currentQuestionType === "symbolToName" ? currentQuestion.name : currentQuestion.symbol)
            });
            resultRecorded = true;
        }
    }

    function resetQuiz() {
        score = 0;
        correctCount = 0;
        incorrectCount = 0;
        updateScoreDisplay();
    }

    // 최종 결과 화면 표시
    function showFinalScreen() {
        quizScreen.style.display = "none";
        finalScreen.style.display = "block";
        finalScoreDisplay.textContent = `최종 점수: ${score} | 정답 개수: ${correctCount} | 오답 개수: ${incorrectCount}`;
    }

    // 결과 분석 버튼 클릭 시 표 형식으로 분석 내역 표시 (맞은 경우 O, 틀린 경우 X; 첫 시도 기준)
    analyzeBtn.addEventListener("click", () => {
        let analysisHTML = `
            <table>
                <thead>
                    <tr>
                        <th>문제 번호</th>
                        <th>문제 내용</th>
                        <th>정답</th>
                        <th>사용자 입력 (시도 순)</th>
                        <th>결과</th>
                    </tr>
                </thead>
                <tbody>
        `;
        resultDetails.forEach((result, index) => {
            let questionStr = "";
            let correctAnswer = "";
            if (result.questionType === "symbolToName") {
                questionStr = `원소 기호: ${result.symbol}`;
                correctAnswer = result.name;
            } else {
                questionStr = `원소 이름: ${result.name}`;
                correctAnswer = result.symbol;
            }
            let attemptsStr = result.attempts.join(" → ");
            // 첫 시도 기준: 맞으면 O, 틀리면 X
            let outcome = result.correct ? "O" : "X";
            analysisHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${questionStr}</td>
                    <td>${correctAnswer}</td>
                    <td>${attemptsStr}</td>
                    <td>${outcome}</td>
                </tr>
            `;
        });
        analysisHTML += `
                </tbody>
            </table>
        `;
        analysisDetails.innerHTML = analysisHTML;
        analysisDetails.style.display = "block";
    });

    // 최종 결과 화면의 '퀴즈 다시 시작' 버튼 클릭 시 모든 변수 초기화 후 첫 화면으로
    restartQuizFinal.addEventListener("click", () => {
        finalScreen.style.display = "none";
        analysisDetails.innerHTML = "";
        analysisDetails.style.display = "none";
        // 모든 기록 초기화
        resultDetails = [];
        currentAttempts = [];
        startScreen.style.display = "block";
    });

    // 이벤트 리스너
    startQuizBtn.addEventListener("click", () => {
        startScreen.style.display = "none";
        typeSelectionScreen.style.display = "block";
    });

    confirmTypeBtn.addEventListener("click", () => {
        typeSelectionScreen.style.display = "none";
        quizScreen.style.display = "block";
        resetQuiz();
        initializeQuiz();
    });

    stopBtn.addEventListener("click", () => {
        alert(`** 원소 퀴즈 종료! **\n정답 개수: ${correctCount}\n오답 개수: ${incorrectCount}\n최종 점수: ${score}`);
        quizScreen.style.display = "none";
        startScreen.style.display = "block";
    });

    nextBtn.addEventListener("click", () => {
        userInput.focus();
        generateQuestion();
    });

    submitBtn.addEventListener("click", checkAnswer);
    revealBtn.addEventListener("click", revealAnswer);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });
});
