"use strict";

    const STORAGE_KEYS = {
      routine: "sorriso-brilhante.routine.v1",
      quiz: "sorriso-brilhante.quiz.v1"
    };

    function readStored(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch (error) {
        console.warn("Não foi possível ler o progresso salvo.", error);
        return fallback;
      }
    }

    function saveStored(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn("Não foi possível salvar o progresso neste navegador.", error);
      }
    }

    function dateKey(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    function playSound(notes) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      try {
        const context = new AudioContextClass();
        let startAt = context.currentTime;
        notes.forEach(([frequency, duration]) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0.0001, startAt);
          gain.gain.exponentialRampToValueAtTime(0.16, startAt + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(startAt);
          oscillator.stop(startAt + duration);
          startAt += duration * 0.82;
        });
        window.setTimeout(() => context.close(), 1600);
      } catch (error) {
        console.warn("O áudio não pôde ser reproduzido neste navegador.", error);
      }
    }

    const modeButtons = document.querySelectorAll(".mode-button");
    const childMode = document.getElementById("child-mode");
    const familyMode = document.getElementById("family-mode");

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const isFamily = button.dataset.mode === "family";
        modeButtons.forEach((modeButton) => {
          modeButton.setAttribute("aria-pressed", String(modeButton === button));
        });
        childMode.hidden = isFamily;
        familyMode.hidden = !isFamily;
      });
    });

    const TOTAL_SECONDS = 120;
    const timerDisplay = document.getElementById("timer-display");
    const timerCaption = document.getElementById("timer-caption");
    const timerProgress = document.getElementById("timer-progress");
    const progressTrack = timerProgress.parentElement;
    const mouthInstruction = document.getElementById("mouth-instruction");
    const mouthTime = document.getElementById("mouth-time");
    const startButton = document.getElementById("timer-start");
    const pauseButton = document.getElementById("timer-pause");
    const resetButton = document.getElementById("timer-reset");
    const brushingSteps = [
      { end: 30, instruction: "Escove a parte Superior Direita", time: "0:00 – 0:30", zone: "upper-right" },
      { end: 60, instruction: "Escove a parte Superior Esquerda", time: "0:30 – 1:00", zone: "upper-left" },
      { end: 90, instruction: "Escove a parte Inferior Esquerda", time: "1:00 – 1:30", zone: "lower-left" },
      { end: 110, instruction: "Escove a parte Inferior Direita", time: "1:30 – 1:50", zone: "lower-right" },
      { end: 120, instruction: "Agora limpe a Língua!", time: "1:50 – 2:00", zone: "tongue" }
    ];
    let remainingSeconds = TOTAL_SECONDS;
    let timerInterval = null;
    let deadline = 0;
    let lastStep = -1;
    const mouthZones = document.querySelectorAll(".mouth-zone");

    function renderTimer() {
      const elapsed = TOTAL_SECONDS - remainingSeconds;
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      timerDisplay.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
      timerDisplay.setAttribute("aria-label", `${minutes} minutos e ${seconds} segundos restantes`);
      timerProgress.style.width = `${(elapsed / TOTAL_SECONDS) * 100}%`;
      progressTrack.setAttribute("aria-valuenow", String(elapsed));

      const stepIndex = brushingSteps.findIndex((step) => elapsed < step.end);
      const activeStepIndex = stepIndex < 0 ? brushingSteps.length - 1 : stepIndex;
      if (activeStepIndex !== lastStep) {
        lastStep = activeStepIndex;
        mouthInstruction.textContent = brushingSteps[activeStepIndex].instruction;
        mouthTime.textContent = brushingSteps[activeStepIndex].time;
        mouthZones.forEach((zone) => {
          zone.classList.toggle("active", zone.dataset.zone === brushingSteps[activeStepIndex].zone);
        });
      }
    }

    function finishTimer() {
      window.clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = 0;
      renderTimer();
      timerCaption.textContent = "Missão cumprida! Seu sorriso está brilhando! ✨";
      mouthInstruction.textContent = "Parabéns, superescovador!";
      mouthTime.textContent = "Você completou os 2 minutos!";
      startButton.disabled = true;
      pauseButton.disabled = true;
      playSound([[523.25, .18], [659.25, .18], [783.99, .36]]);
    }

    function tickTimer() {
      remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      renderTimer();
      if (remainingSeconds <= 0) finishTimer();
    }

    startButton.addEventListener("click", () => {
      if (timerInterval !== null || remainingSeconds === 0) return;
      timerCaption.textContent = "Continue assim, você está indo muito bem!";
      deadline = Date.now() + remainingSeconds * 1000;
      startButton.disabled = true;
      pauseButton.disabled = false;
      timerInterval = window.setInterval(tickTimer, 200);
      tickTimer();
    });

    pauseButton.addEventListener("click", () => {
      if (timerInterval === null) return;
      window.clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (remainingSeconds <= 0) {
        finishTimer();
        return;
      }
      renderTimer();
      timerCaption.textContent = "Pausa para respirar. Retome quando quiser!";
      startButton.disabled = remainingSeconds === 0;
      pauseButton.disabled = true;
    });

    resetButton.addEventListener("click", () => {
      window.clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = TOTAL_SECONDS;
      lastStep = -1;
      timerCaption.textContent = "Pronto para começar?";
      startButton.disabled = false;
      pauseButton.disabled = true;
      renderTimer();
      mouthInstruction.textContent = "Vamos começar pela parte de cima!";
      mouthTime.textContent = "Sua missão dura 2 minutos";
    });

    const foods = [
      { emoji: "🍎", name: "Maçã", type: "healthy", explanation: "Frutas como a maçã são uma escolha amiga. Água também é ótima para matar a sede!" },
      { emoji: "🥤", name: "Refrigerante", type: "sugary", explanation: "Bebidas açucaradas podem favorecer cáries. Prefira água no dia a dia." },
      { emoji: "🥕", name: "Cenoura", type: "healthy", explanation: "A cenoura é um alimento nutritivo e não tem açúcar adicionado." },
      { emoji: "🍭", name: "Pirulito", type: "sugary", explanation: "Doces grudentos ou consumidos muitas vezes podem aumentar o risco de cárie." },
      { emoji: "🧀", name: "Queijo", type: "healthy", explanation: "Queijo sem açúcar pode fazer parte de uma alimentação variada." },
      { emoji: "🍿", name: "Salgadinho", type: "sugary", explanation: "O amido do salgadinho pode deixar resíduos nos dentes. Evite beliscar o dia todo e escove bem." }
    ];
    const savedQuizValue = readStored(STORAGE_KEYS.quiz, {});
    const savedQuiz = savedQuizValue && typeof savedQuizValue === "object" && !Array.isArray(savedQuizValue) ? savedQuizValue : {};
    let quizIndex = Number.isInteger(savedQuiz.index) && savedQuiz.index >= 0 ? savedQuiz.index % foods.length : 0;
    let quizScore = Number.isInteger(savedQuiz.score) && savedQuiz.score >= 0 ? savedQuiz.score : 0;
    let quizAnswered = Number.isInteger(savedQuiz.answered) && savedQuiz.answered >= 0 ? savedQuiz.answered : 0;
    let hasAnswered = savedQuiz.answeredQuestion === true;
    const foodEmoji = document.getElementById("food-emoji");
    const foodName = document.getElementById("food-name");
    const quizScoreElement = document.getElementById("quiz-score");
    const quizProgress = document.getElementById("quiz-progress");
    const gameFeedback = document.getElementById("game-feedback");
    const quizNextButton = document.getElementById("quiz-next");
    const answerButtons = document.querySelectorAll(".answer-button");

    function renderFood() {
      const food = foods[quizIndex];
      foodEmoji.textContent = food.emoji;
      foodName.textContent = food.name;
      quizScoreElement.textContent = String(quizScore);
      quizProgress.textContent = `Pergunta ${quizIndex + 1} de ${foods.length} · ${quizAnswered} respondida${quizAnswered === 1 ? "" : "s"}`;
      gameFeedback.className = "game-feedback";
      gameFeedback.textContent = hasAnswered
        ? "Você já respondeu a este alimento. Continue para o próximo!"
        : "Escolha uma resposta para jogar!";
      quizNextButton.hidden = !hasAnswered;
      answerButtons.forEach((button) => { button.disabled = hasAnswered; });
    }

    answerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (hasAnswered) return;
        hasAnswered = true;
        const food = foods[quizIndex];
        const correct = button.dataset.answer === food.type;
        quizAnswered += 1;
        if (correct) quizScore += 1;
        saveStored(STORAGE_KEYS.quiz, { index: quizIndex, score: quizScore, answered: quizAnswered, answeredQuestion: true });
        quizScoreElement.textContent = String(quizScore);
        quizProgress.textContent = `Pergunta ${quizIndex + 1} de ${foods.length} · ${quizAnswered} respondida${quizAnswered === 1 ? "" : "s"}`;
        gameFeedback.className = `game-feedback ${correct ? "success" : "try-again"}`;
        gameFeedback.textContent = `${correct ? "Isso mesmo! Muito bem! " : "Quase! Vamos aprender juntos. "}${food.explanation}`;
        answerButtons.forEach((answerButton) => { answerButton.disabled = true; });
        quizNextButton.hidden = false;
        playSound(correct ? [[659.25, .12], [783.99, .19]] : [[392, .2]]);
      });
    });

    quizNextButton.addEventListener("click", () => {
      quizIndex = (quizIndex + 1) % foods.length;
      hasAnswered = false;
      saveStored(STORAGE_KEYS.quiz, { index: quizIndex, score: quizScore, answered: quizAnswered, answeredQuestion: false });
      renderFood();
    });

    renderFood();

    const savedRoutine = readStored(STORAGE_KEYS.routine, {});
    const routineHistory = savedRoutine && typeof savedRoutine === "object" && !Array.isArray(savedRoutine) ? savedRoutine : {};
    const today = dateKey(new Date());
    document.getElementById("today-label").textContent = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(new Date());

    function getDayRecord(key) {
      const record = routineHistory[key];
      return record && typeof record === "object" ? record : {};
    }

    function renderRoutineButtons() {
      const todayRecord = getDayRecord(today);
      document.querySelectorAll(".routine-button").forEach((button) => {
        const checked = todayRecord[button.dataset.routine] === true;
        button.setAttribute("aria-pressed", String(checked));
        button.querySelector(".routine-status").textContent = checked ? "Missão concluída! ✓" : "Toque para marcar";
      });
    }

    function renderWeek() {
      const weekGrid = document.getElementById("week-grid");
      weekGrid.replaceChildren();
      const weekdayNames = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
      for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        date.setDate(date.getDate() - offset);
        const key = dateKey(date);
        const record = getDayRecord(key);
        const count = Number(record.morning === true) + Number(record.night === true);
        const chip = document.createElement("div");
        chip.className = `day-chip${key === today ? " today" : ""}`;
        chip.setAttribute("aria-label", `${weekdayNames[date.getDay()]}, ${count} de 2 escovações marcadas`);
        const name = document.createElement("span");
        name.className = "day-name";
        name.textContent = weekdayNames[date.getDay()];
        const checks = document.createElement("span");
        checks.className = "day-checks";
        checks.setAttribute("aria-hidden", "true");
        checks.textContent = `${record.morning === true ? "☀️" : "·"} ${record.night === true ? "🌙" : "·"}`;
        const total = document.createElement("span");
        total.className = "day-count";
        total.textContent = `${count}/2 missões`;
        chip.append(name, checks, total);
        weekGrid.append(chip);
      }
    }

    document.querySelectorAll(".routine-button").forEach((button) => {
      button.addEventListener("click", () => {
        const todayRecord = getDayRecord(today);
        todayRecord[button.dataset.routine] = todayRecord[button.dataset.routine] !== true;
        routineHistory[today] = todayRecord;
        saveStored(STORAGE_KEYS.routine, routineHistory);
        renderRoutineButtons();
        renderWeek();
      });
    });

    renderRoutineButtons();
    renderWeek();
