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
    let currentQuestionType = ""; // 각 문제의 유형을 저장하는 변수
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let answered = false;
    let attempt = 0;

    // 화면 요소들
    const startScreen = document.getElementById("startScreen");
    const typeSelectionScreen = document.getElementById("typeSelectionScreen");
    const quizScreen = document.getElementById("quizScreen");

    // 유형 선택 관련 요소 (typeSelectionScreen)
    const quizTypeSelect = document.getElementById("quizType");
    const confirmTypeBtn = document.getElementById("confirmType");

    // 퀴즈 화면 관련 요소
    const startQuizBtn = document.getElementById("startQuiz"); // 시작 화면의 버튼
    const questionDisplay = document.getElementById("question");
    const userInput = document.getElementById("userInput");
    const submitBtn = document.getElementById("submit");
    const nextBtn = document.getElementById("next");
    const revealBtn = document.getElementById("reveal");
    const stopBtn = document.getElementById("stop");
    const resultDisplay = document.getElementById("result");
    const scoreDisplay = document.getElementById("scoreDisplay");

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function initializeQuiz() {
        shuffledElements = shuffleArray(Object.keys(elements));
        currentIndex = 0;
        score = 0;
        correctCount = 0;
        incorrectCount = 0;
        updateScoreDisplay();
        generateQuestion();
    }

    function getNextElement() {
        if (currentIndex >= shuffledElements.length) {
            initializeQuiz();
        }
        const symbol = shuffledElements[currentIndex];
        currentIndex++;
        return { symbol: symbol, name: elements[symbol] };
    }

    // 점수만 업데이트
    function updateScoreDisplay() {
        scoreDisplay.textContent = `점수: ${score} | 정답 개수: ${correctCount} | 오답 개수: ${incorrectCount}`;
    }

    function generateQuestion() {
        answered = false;
        attempt = 0;
        revealBtn.style.display = "none";
        resultDisplay.classList.remove("blinking", "blinking2");
        let type = quizTypeSelect.value;
        // mixed 모드인 경우 각 문제마다 랜덤하게 유형 선택
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
    }

    function checkAnswer() {
        if (answered) return;
        const answer = userInput.value.trim();
        if (!answer) return;
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
        if (answer === correctAnswer) {
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
    }

    function resetQuiz() {
        score = 0;
        correctCount = 0;
        incorrectCount = 0;
        updateScoreDisplay();
    }

    // 이벤트 리스너
    // 시작 화면의 "퀴즈 시작!" 버튼을 누르면 유형 선택 화면으로 전환
    startQuizBtn.addEventListener("click", () => {
        startScreen.style.display = "none";
        typeSelectionScreen.style.display = "block";
    });

    // 유형 선택 화면에서 "선택 완료" 버튼을 누르면 퀴즈 화면으로 전환 후 퀴즈 시작
    confirmTypeBtn.addEventListener("click", () => {
        typeSelectionScreen.style.display = "none";
        quizScreen.style.display = "block";
        resetQuiz();
        initializeQuiz();
    });

    // 퀴즈 종료 버튼 (퀴즈 중 종료 시)
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
