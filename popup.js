let utterance = null;
let isPlaying = false;
let currentRate = 1.0;

// Play/Pause toggle button
document.getElementById('playPause').addEventListener('click', async () => {
  if (isPlaying) {
    speechSynthesis.pause();
    document.getElementById('playPause').textContent = "Play";
    isPlaying = false;
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  }, (results) => {
    if (chrome.runtime.lastError) {
      alert("Error getting selected text.");
      return;
    }

    const selectedText = results?.[0]?.result?.trim();
    if (selectedText) {
      speechSynthesis.cancel();
      utterance = new SpeechSynthesisUtterance(selectedText);
      utterance.rate = currentRate;
      speechSynthesis.speak(utterance);
      document.getElementById('playPause').textContent = "Pause";
      isPlaying = true;

      utterance.onend = () => {
        document.getElementById('playPause').textContent = "Play";
        isPlaying = false;
      };
    } else {
      alert("Please select some text first.");
    }
  });
});

// Resume if paused
speechSynthesis.onpause = () => {
  isPlaying = false;
};

speechSynthesis.onresume = () => {
  isPlaying = true;
  document.getElementById('playPause').textContent = "Pause";
};

// Speed button toggle
document.getElementById('speed').addEventListener('click', () => {
  const speedControls = document.getElementById('speedControls');
  speedControls.classList.toggle('hidden');
});

// Handle speed slider
document.getElementById('rateSlider').addEventListener('input', (e) => {
  const level = parseInt(e.target.value);
  currentRate = 0.5 + (level - 1) * 0.375; // Level 1: 0.5x ... Level 5: 2.0x
  document.getElementById('rateLabel').textContent = `Speed: ${currentRate.toFixed(1)}x`;
});

// AI button
document.getElementById('ai').addEventListener('click', () => {
  alert("AI Summary Coming Soon!");
});

// Close button
document.getElementById('close').addEventListener('click', () => {
  window.close();
});
