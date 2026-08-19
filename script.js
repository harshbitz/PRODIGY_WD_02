// Elements
const display = document.getElementById('display');
const ringFg = document.getElementById('ringFg');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapList = document.getElementById('lapList');

// State
let elapsedMs = 0;
let intervalId = null;
let lastTick = 0;
let lapCount = 0;

const RING_CIRCUMFERENCE = 615.75; // 2 * PI * radius(98)
const RING_DURATION_MS = 60000;    // the ring completes one full lap every 60 seconds

// Format ms as MM:SS + centiseconds (shown separately in the markup)
function formatTime(ms) {
  const centiseconds = Math.floor((ms % 1000) / 10);
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  const pad = (num) => String(num).padStart(2, '0');
  return { time: `${pad(minutes)}:${pad(seconds)}`, cs: pad(centiseconds) };
}

function updateDisplay() {
  const { time, cs } = formatTime(elapsedMs);
  display.innerHTML = `${time}<span class="cs">.${cs}</span>`;

  // Animate the ring: it fills up once per 60 seconds, then loops
  const progress = (elapsedMs % RING_DURATION_MS) / RING_DURATION_MS;
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  ringFg.style.strokeDashoffset = offset;
}

function start() {
  if (intervalId) return;
  lastTick = Date.now();

  intervalId = setInterval(() => {
    const now = Date.now();
    elapsedMs += now - lastTick;
    lastTick = now;
    updateDisplay();
  }, 10);

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  lapBtn.disabled = false;
}

function pause() {
  clearInterval(intervalId);
  intervalId = null;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function reset() {
  clearInterval(intervalId);
  intervalId = null;
  elapsedMs = 0;
  lapCount = 0;
  updateDisplay();
  lapList.innerHTML = '';

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;
}

function recordLap() {
  lapCount++;
  const { time, cs } = formatTime(elapsedMs);
  const li = document.createElement('li');
  li.innerHTML = `<span>Lap ${lapCount}</span><span>${time}.${cs}</span>`;
  lapList.prepend(li);
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);