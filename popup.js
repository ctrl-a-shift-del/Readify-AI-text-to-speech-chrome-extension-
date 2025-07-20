document.addEventListener("DOMContentLoaded", () => {
  const summarizeBtn = document.getElementById("summarize-text");
  const readBtn = document.getElementById("read-text");
  const statusDiv = document.getElementById("status");
  const voiceSelect = document.getElementById("voice");
  const audio = document.getElementById("tts-audio");
  const summaryContainer = document.getElementById("summary-container");
  const summaryText = document.getElementById("summary-text");

  const GOOGLE_TTS_API_KEY = "your_google_tts_api_key_here";

  function updateStatus(message, type = "info") {
    statusDiv.textContent = message;
    statusDiv.className = `status-${type}`;
  }

  function showSummary(summary) {
    summaryText.textContent = summary;
    summaryContainer.classList.remove("hidden");
  }

  function hideSummary() {
    summaryContainer.classList.add("hidden");
    summaryText.textContent = "";
  }

  async function fetchTTSAudio(text, voice) {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`;
    const requestBody = {
      input: { text },
      voice: {
        languageCode: voice.split("-").slice(0, 2).join("-"),
        name: voice
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.25
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await res.json();
    if (data.audioContent) {
      return `data:audio/mp3;base64,${data.audioContent}`;
    } else {
      throw new Error("Failed to get audio from Google TTS");
    }
  }

  async function playTextWithTTS(text, voice) {
    try {
      updateStatus("Generating speech audio...", "info");
      const audioUrl = await fetchTTSAudio(text, voice);
      audio.src = audioUrl;
      audio.style.display = "block";
      audio.play();
      updateStatus("Reading started.", "success");
    } catch (err) {
      updateStatus("TTS failed: " + err.message, "error");
      console.error(err);
    }
  }

  async function getSelectedTextFromTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    });
    return results[0]?.result || "";
  }

  summarizeBtn.addEventListener("click", async () => {
    updateStatus("Getting selected text...", "info");
    summarizeBtn.disabled = true;
    hideSummary();

    try {
      const selectedText = await getSelectedTextFromTab();
      if (!selectedText.trim()) {
        updateStatus("Please select some text first.", "error");
        summarizeBtn.disabled = false;
        return;
      }

      updateStatus("Summarizing...", "info");

      chrome.runtime.sendMessage(
        { action: "summarize", text: selectedText },
        async (response) => {
          summarizeBtn.disabled = false;

          if (chrome.runtime.lastError || !response?.summary) {
            updateStatus("Failed to summarize.", "error");
            return;
          }

          const summary = response.summary;
          showSummary(summary);

          const voice = voiceSelect.value;
          await playTextWithTTS(summary, voice);
        }
      );
    } catch (err) {
      updateStatus("Error: " + err.message, "error");
      summarizeBtn.disabled = false;
    }
  });

  readBtn.addEventListener("click", async () => {
    updateStatus("Getting selected text...", "info");
    readBtn.disabled = true;
    hideSummary();

    try {
      const selectedText = await getSelectedTextFromTab();
      if (!selectedText.trim()) {
        updateStatus("Please select some text first.", "error");
        readBtn.disabled = false;
        return;
      }

      const voice = voiceSelect.value;
      await playTextWithTTS(selectedText, voice);
      updateStatus("Reading selected text.", "success");
    } catch (err) {
      updateStatus("Error: " + err.message, "error");
    } finally {
      readBtn.disabled = false;
    }
  });
});
