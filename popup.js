const synth = window.speechSynthesis;
let voices = [];
let state = "idle"; // idle, speaking, paused
let currentUtterance = null;
let currentRate = 1.0;
let lastSelectedText = "";

// UI Elements
const playPauseBtn = document.getElementById("playPauseBtn");
const reloadBtn = document.getElementById("reloadBtn");
const exitBtn = document.getElementById("exitBtn");
const accentBtn = document.getElementById("accentBtn");
const speedBtn = document.getElementById("speedBtn");
const aiBtn = document.getElementById("aiBtn");
const logoBtn = document.getElementById("logoBtn");

// Content area elements
const defaultMessage = document.getElementById("defaultMessage");
const voiceControls = document.getElementById("voiceControls");
const speedControls = document.getElementById("speedControls");
const aiMessage = document.getElementById("aiMessage");

// Voice selection elements
const voiceSelect = document.getElementById("voiceSelect");
const rateSlider = document.getElementById("rateSlider");
const rateLabel = document.getElementById("rateLabel");

// ========== LOAD FROM LOCAL STORAGE ==========
function loadSettings() {
  const savedVoice = localStorage.getItem("voice");
  const savedRate = localStorage.getItem("rate") || "3";

  rateSlider.value = savedRate;
  const level = parseInt(savedRate);
  currentRate = 0.5 + (level - 1) * 0.375;
  rateLabel.textContent = `Speed: ${currentRate.toFixed(1)}x`;

  loadVoices(savedVoice);
}

// ========== SAVE TO LOCAL STORAGE ==========
function saveSettings() {
  localStorage.setItem("voice", voiceSelect.value);
  localStorage.setItem("rate", rateSlider.value);
}

// ========== LOAD VOICES ==========
function loadVoices(preselectedVoice = null) {
  voices = synth.getVoices();
  if (!voices.length) return;

  voiceSelect.innerHTML = "";

  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? " — Default" : ""}`;
    voiceSelect.appendChild(option);
  });

  if (preselectedVoice && [...voiceSelect.options].some(opt => opt.value === preselectedVoice)) {
    voiceSelect.value = preselectedVoice;
  }
}

// ========== APPLY SETTINGS TO NEW UTTERANCE ==========
function createUtterance(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = currentRate;

  const matchedVoice = voices.find(v => v.name === voiceSelect.value);
  if (matchedVoice) utterance.voice = matchedVoice;

  utterance.onend = () => {
    state = "idle";
    playPauseBtn.querySelector("img").src = "icons/play.png";
    currentUtterance = null;
  };

  return utterance;
}

// ========== SPEAK TEXT ==========
function speakText(text) {
  if (!text) {
    alert("Please select some text on the page.");
    return;
  }

  lastSelectedText = text;
  synth.cancel();
  currentUtterance = createUtterance(text);
  synth.speak(currentUtterance);
  state = "speaking";
  playPauseBtn.querySelector("img").src = "icons/pause.png";
}

// ========== SHOW/HIDE CONTENT AREAS ==========
function showDefaultMessage() {
  defaultMessage.style.display = "flex";
  voiceControls.style.display = "none";
  speedControls.style.display = "none";
  aiMessage.style.display = "none";
}

function showVoiceControls() {
  defaultMessage.style.display = "none";
  voiceControls.style.display = "block";
  speedControls.style.display = "none";
  aiMessage.style.display = "none";
}

function showSpeedControls() {
  defaultMessage.style.display = "none";
  voiceControls.style.display = "none";
  speedControls.style.display = "block";
  aiMessage.style.display = "none";
}

function showAIMessage() {
  defaultMessage.style.display = "none";
  voiceControls.style.display = "none";
  speedControls.style.display = "none";
  aiMessage.style.display = "flex";
}

// ========== EVENT LISTENERS ==========

// Voice loading
speechSynthesis.onvoiceschanged = () => loadVoices(localStorage.getItem("voice"));

// Voice selection
voiceSelect.addEventListener("change", () => {
  synth.pause(); // Pause when changing voice
  state = "paused";
  saveSettings();
  if (lastSelectedText) {
    speakText(lastSelectedText);
    synth.pause(); // Keep it paused after applying new voice
    playPauseBtn.querySelector("img").src = "icons/play.png";
  }
});

// Speed control
rateSlider.addEventListener("input", (e) => {
  const level = parseInt(e.target.value);
  currentRate = 0.5 + (level - 1) * 0.375;
  rateLabel.textContent = `Speed: ${currentRate.toFixed(1)}x`;
  saveSettings();
  
  // Pause and update if currently speaking
  if (state === "speaking" || state === "paused") {
    synth.pause();
    state = "paused";
    if (lastSelectedText) {
      speakText(lastSelectedText);
      synth.pause(); // Keep it paused after applying new speed
      playPauseBtn.querySelector("img").src = "icons/play.png";
    }
  }
});

// Play/Pause button
playPauseBtn.addEventListener("click", () => {
  if (state === "idle") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => window.getSelection().toString()
      }, (results) => {
        const selectedText = results?.[0]?.result?.trim();
        if (selectedText) speakText(selectedText);
        else alert("Please select some text on the page.");
      });
    });
  } else if (state === "speaking") {
    synth.pause();
    state = "paused";
    playPauseBtn.querySelector("img").src = "icons/play.png";
  } else if (state === "paused") {
    synth.resume();
    state = "speaking";
    playPauseBtn.querySelector("img").src = "icons/pause.png";
  }
});

// Reload button
reloadBtn.addEventListener("click", () => {
  if (!lastSelectedText) {
    alert("Please click the Play button");
    return;
  }
  synth.cancel();
  if (lastSelectedText) speakText(lastSelectedText);
});

// Exit button
exitBtn.addEventListener("click", () => {
  synth.cancel();
  window.close();
});

// Accent button
accentBtn.addEventListener("click", () => {
  showVoiceControls();
});

// Speed button
speedBtn.addEventListener("click", () => {
  showSpeedControls();
});

// Logo button
logoBtn.addEventListener("click", () => {
  showDefaultMessage();
});

// AI button
aiBtn.addEventListener("click", () => {
  showAIMessage();
});

// ========== INIT ==========
loadSettings();
showDefaultMessage();