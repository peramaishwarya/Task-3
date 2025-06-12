const quizData = [
  {
    type: "single",
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris"
  },
  {
    type: "multi",
    question: "Select all prime numbers:",
    options: ["2", "3", "4", "5"],
    answer: ["2", "3", "5"]
  },
  {
    type: "text",
    question: "Fill in the blank: The largest planet is ____.",
    answer: "Jupiter"
  },
  {
    type: "single",
    question: "What is the chemical symbol for water?",
    options: ["O2", "H2O", "CO2", "NaCl"],
    answer: "H2O"
  },
  {
    type: "single",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars"
  },
  {
    type: "multi",
    question: "Which of the following are mammals?",
    options: ["Whale", "Shark", "Bat", "Penguin"],
    answer: ["Whale", "Bat"]
  },
  {
    type: "text",
    question: "Fill in the blank: The speed of light is approximately 3.0 x 10^____ m/s.",
    answer: "8"
  }
];

let currentQuestion = 0;
let userAnswers = new Array(quizData.length).fill(null);

function renderQuestion(index) {
  const container = document.getElementById("quiz-container");
  const q = quizData[index];
  let inputHtml = "";

  if (q.type === "single") {
    inputHtml = q.options.map(opt =>
      `<label>
         <input type="radio" name="q${index}" value="${opt}" ${userAnswers[index] === opt ? "checked" : ""}>
         ${opt}
       </label>`
    ).join("");
  } else if (q.type === "multi") {
    inputHtml = q.options.map(opt =>
      `<label>
         <input type="checkbox" name="q${index}" value="${opt}" ${userAnswers[index]?.includes(opt) ? "checked" : ""}>
         ${opt}
       </label>`
    ).join("");
  } else if (q.type === "text") {
    inputHtml = `<input type="text" name="q${index}" value="${userAnswers[index] || ""}" placeholder="Your answer here" />`;
  }

  container.innerHTML = `
    <div class="question">${index + 1}. ${q.question}</div>
    <div class="options">${inputHtml}</div>
  `;

  document.getElementById("prev-btn").style.display = index === 0 ? "none" : "inline-block";
  document.getElementById("next-btn").style.display = index === quizData.length - 1 ? "none" : "inline-block";
  document.getElementById("submit-btn").style.display = index === quizData.length - 1 ? "inline-block" : "none";
}

function saveAnswer(index) {
  const inputs = document.getElementsByName(`q${index}`);
  const q = quizData[index];

  if (q.type === "single") {
    for (let input of inputs) {
      if (input.checked) {
        userAnswers[index] = input.value;
        return;
      }
    }
    userAnswers[index] = null;
  } else if (q.type === "multi") {
    userAnswers[index] = [];
    for (let input of inputs) {
      if (input.checked) {
        userAnswers[index].push(input.value);
      }
    }
  } else if (q.type === "text") {
    userAnswers[index] = inputs[0].value.trim();
  }
}

function restartQuiz() {
  currentQuestion = 0;
  userAnswers = new Array(quizData.length).fill(null);
  document.querySelector(".quiz-wrapper").style.display = "flex";
  document.getElementById("result-screen").style.display = "none";
  renderQuestion(currentQuestion);
}

// Initial render
renderQuestion(currentQuestion);

document.getElementById("next-btn").addEventListener("click", () => {
  saveAnswer(currentQuestion);
  currentQuestion++;
  renderQuestion(currentQuestion);
});

document.getElementById("prev-btn").addEventListener("click", () => {
  saveAnswer(currentQuestion);
  currentQuestion--;
  renderQuestion(currentQuestion);
});

document.getElementById("submit-btn").addEventListener("click", () => {
  saveAnswer(currentQuestion);

  let score = 0;

  quizData.forEach((q, index) => {
    const userAnswer = userAnswers[index];

    if (q.type === "single" && userAnswer === q.answer) {
      score++;
    } else if (q.type === "multi") {
      const correct = q.answer;
      if (
        Array.isArray(userAnswer) &&
        userAnswer.length === correct.length &&
        userAnswer.every(a => correct.includes(a))
      ) {
        score++;
      }
    } else if (q.type === "text" && userAnswer?.toLowerCase() === q.answer.toLowerCase()) {
      score++;
    }
  });

  // Show result screen
  document.querySelector(".quiz-wrapper").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  document.getElementById("final-score").textContent = `You scored ${score} out of ${quizData.length}`;
});
