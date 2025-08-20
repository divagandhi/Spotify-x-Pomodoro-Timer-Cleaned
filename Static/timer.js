const pomodoroTime = document.querySelector(".pomodoro_time");
const sound = document.querySelector("audio");
const treeImage = document.getElementById("tree");
const progressCircle = document.querySelector(".progress-ring__circle");

let countdown;
let sessionCount = 1;

const radius = progressCircle.r.baseVal.value; //gives me radius of my timer circle
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

export function timer(totalSeconds) {
  clearInterval(countdown);
  const start = Date.now();
  const finish = start + totalSeconds * 1000;

  displayTimeLeft(totalSeconds);
  setProgress(1); // Start full ring

  countdown = setInterval(() => {
  const secondsLeft = Math.round((finish - Date.now()) / 1000);

    if (secondsLeft <= 0) {
      clearInterval(countdown);
      displayTimeLeft(0);
      setProgress(0);
      document.title = "Time Up!";
      sound.play();
      growTree();
      return;
    }

    displayTimeLeft(secondsLeft);
    setProgress(secondsLeft / totalSeconds);
  }, 1000);
}

export function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  const displayTime = `${minutes}:${secondsRemaining < 10 ? "0" : ""}${secondsRemaining}`;
  document.title = displayTime;

  if (pomodoroTime) {
    pomodoroTime.textContent = displayTime;
  }
}

function growTree() {
  sessionCount++;
  const newTreeStage = `/static/assets/tree${sessionCount}.png`;
  if (treeImage) {
    treeImage.src = newTreeStage;
  }
}

function setProgress(percent) {
  const offset = circumference * (1 - percent);
  progressCircle.style.strokeDashoffset = offset;
}