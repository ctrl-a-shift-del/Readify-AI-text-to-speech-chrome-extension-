let utterance = null; // Store the speech instance

// PLAY button
document.getElementById('play').addEventListener('click', async () => {
  // Get selected text from the current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString() // grab selected text
  }, (results) => {
    const selectedText = results[0].result;
    if (selectedText) {
      utterance = new SpeechSynthesisUtterance(selectedText); // create speech
      speechSynthesis.speak(utterance); // start reading
    } else {
      alert("Please select some text on the page first.");
    }
  });
});

// PAUSE button
document.getElementById('pause').addEventListener('click', () => {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause(); // pause if speaking
  } else if (speechSynthesis.paused) {
    speechSynthesis.resume(); // resume if already paused
  }
});

// STOP button
document.getElementById('stop').addEventListener('click', () => {
  speechSynthesis.cancel(); // stop everything
});

// AI (dummy button)
document.getElementById('ai').addEventListener('click', () => {
  alert("AI Summary Coming Soon!");
});
