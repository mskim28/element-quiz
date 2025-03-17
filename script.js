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
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let answered = false;
    let attempt = 0;

    const quizTypeSelect = document.getElementById("quizType");
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

    function initializeQuestionPool() {
        shuffledElements = shuffleArray(Object.keys(elements));
        currentIndex = 0;
    }

    function getNextElement() {
        if (currentIndex >= shuffledElements.length) {
            initializeQuestionPool();
        }
        const symbol = shuffledElements[currentIndex];
        currentIndex++;
        return { symbol: symbol, name: elements[symbol] };
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `점수: ${score} | 정답 개수: ${correctCount} | 오답 개수: ${incorrectCount}`;
    }

    function generateQuestion() {
        answered = false;
        attempt = 0;
        revealBtn.style.display = "none";
        resultDisplay.classList.remove("blinking");
        resultDisplay.classList.remove("blinking2");
        const type = quizTypeSelect.value;
        currentQuestion = getNextElement();
        if (type === "symbolToName") {
            questionDisplay.textContent = `원소 기호: ${currentQuestion.symbol}`;
        } else if (type === "nameToSymbol") {
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

        if (quizTypeSelect.value === "symbolToName") {
            if (alternativeNames[currentQuestion.symbol]) {
                const possibleAnswers = alternativeNames[currentQuestion.symbol];
                if (possibleAnswers.includes(answer)) {
                    correctAnswer = answer;
                }
            } else {
                correctAnswer = currentQuestion.name;
            }

        } else if (quizTypeSelect.value === "nameToSymbol") {
            correctAnswer = currentQuestion.symbol;
        }

        if (answer === correctAnswer) {
            if(attempt >=1){
                resultDisplay.classList.add("blinking2");
                resultDisplay.textContent = "이번에는 정답입니다!";
                answered = true;
                nextBtn.style.display = "inline-block";
                revealBtn.style.display = "none"; // 정답이면 정답 확인 버튼 숨김
            }else{
                score++;
                score++;
                correctCount++;
                resultDisplay.textContent = "정답입니다!";
                resultDisplay.classList.remove("blinking");
                answered = true;
                nextBtn.style.display = "inline-block";
                revealBtn.style.display = "none"; // 정답이면 정답 확인 버튼 숨김
            }
            
        } else {
            score--;
            attempt++;
            incorrectCount++;
            revealBtn.style.display = "inline-block"; 
            resultDisplay.textContent = "오답입니다. 다시 입력하세요.";
            if(attempt >=2){
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

    submitBtn.addEventListener("click", checkAnswer);
    revealBtn.addEventListener("click", revealAnswer);
    nextBtn.addEventListener("click", generateQuestion);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    stopBtn.addEventListener("click", () => {
        alert(`** 원소 퀴즈 종료! **\n정답 개수: ${correctCount}\n오답 개수: ${incorrectCount}\n최종 점수: ${score}`);
        location.reload();
    });

    quizTypeSelect.addEventListener("change", generateQuestion);
    initializeQuestionPool();
    generateQuestion();
    updateScoreDisplay();
});
