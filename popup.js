let voices = [];
const voiceSelect = document.getElementById("voiceSelect");
const genderSelect = document.getElementById("genderSelect");
const speakBtn = document.getElementById("speak");
const rateSlider = document.getElementById("rateSlider");
const rateLabel = document.getElementById("rateLabel");

let state = "idle"; // idle, speaking, paused
let currentUtterance = null;
let currentRate = 1.0;
let lastSelectedText = "";

// ========== LOAD FROM LOCAL STORAGE ==========
function loadSettings() {
  const savedGender = localStorage.getItem("gender") || "all";
  const savedVoice = localStorage.getItem("voice");
  const savedRate = localStorage.getItem("rate") || "3";

  genderSelect.value = savedGender;
  rateSlider.value = savedRate;
  const level = parseInt(savedRate);
  currentRate = 0.5 + (level - 1) * 0.375;
  rateLabel.textContent = `Speed: ${currentRate.toFixed(1)}x`;

  loadVoices(savedVoice);
}

// ========== SAVE TO LOCAL STORAGE ==========
function saveSettings() {
  localStorage.setItem("gender", genderSelect.value);
  localStorage.setItem("voice", voiceSelect.value);
  localStorage.setItem("rate", rateSlider.value);
}

// ========== VOICE GENDER INFERENCE ==========
function inferGender(voice) {
  const name = voice.name.toLowerCase();
  const genderKeywords = {
    male: ["male", "man", "john", "david", "michael", "alex", "daniel"],
    female: ["female", "woman", "susan", "emma", "victoria", "karen", "linda"]
  };
  if (genderKeywords.female.some(word => name.includes(word))) return "female";
  if (genderKeywords.male.some(word => name.includes(word))) return "male";
  return voice.name.includes("female") ? "female"
       : voice.name.includes("male") ? "male"
       : "unknown";
}

// ========== LOAD VOICES ==========
function loadVoices(preselectedVoice = null) {
  voices = speechSynthesis.getVoices();
  if (!voices.length) return;

  const selectedGender = genderSelect.value;
  voiceSelect.innerHTML = "";

  voices.forEach((voice) => {
    const gender = inferGender(voice);
    if (selectedGender !== "all" && gender !== selectedGender) return;

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
    speakBtn.textContent = "Speak Selected Text";
    currentUtterance = null;
  };

  return utterance;
}

// ========== SPEAK TEXT ==========
function speakText(text) {
  lastSelectedText = text;
  if (!text) {
    alert("Please select some text.");
    return;
  }

  speechSynthesis.cancel();
  currentUtterance = createUtterance(text);
  speechSynthesis.speak(currentUtterance);
  state = "speaking";
  speakBtn.textContent = "Pause";
}

// ========== EVENT LISTENERS ==========

speechSynthesis.onvoiceschanged = () => loadVoices(localStorage.getItem("voice"));

genderSelect.addEventListener("change", () => {
  saveSettings();
  loadVoices();
  if (state === "paused" && lastSelectedText) speakText(lastSelectedText);
});

voiceSelect.addEventListener("change", () => {
  saveSettings();
  if (state === "paused" && lastSelectedText) speakText(lastSelectedText);
});

rateSlider.addEventListener("input", (e) => {
  const level = parseInt(e.target.value);
  currentRate = 0.5 + (level - 1) * 0.375;
  rateLabel.textContent = `Speed: ${currentRate.toFixed(1)}x`;
  saveSettings();
  if (state === "paused" && lastSelectedText) speakText(lastSelectedText);
});

speakBtn.addEventListener("click", () => {
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
    speechSynthesis.pause();
    state = "paused";
    speakBtn.textContent = "Resume";

  } else if (state === "paused") {
    speechSynthesis.resume();
    state = "speaking";
    speakBtn.textContent = "Pause";
  }
});

// ========== INIT ==========
loadSettings();
