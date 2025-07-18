document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-reading");
  const statusDiv = document.getElementById("status");
  const voiceSelect = document.getElementById("voice");
  const audio = document.getElementById("tts-audio");
  const summaryContainer = document.getElementById("summary-container");
  const summaryText = document.getElementById("summary-text");

  const GOOGLE_TTS_API_KEY = "AIzaSyDfkYbvnCDIobGnzFngGqnHCfhwxlvbfTM"; // Replace this!

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
        speakingRate: 1.0 // Fixed speed
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

  startButton.addEventListener("click", async () => {
    try {
      updateStatus("Getting selected text...", "info");
      startButton.disabled = true;
      hideSummary(); // Hide previous summary

      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => window.getSelection().toString()
        },
        (results) => {
          if (chrome.runtime.lastError) {
            updateStatus(`Script error: ${chrome.runtime.lastError.message}`, "error");
            startButton.disabled = false;
            return;
          }

          const selectedText = results[0]?.result || "";

          if (!selectedText.trim()) {
            updateStatus("Please select some text first.", "error");
            startButton.disabled = false;
            return;
          }

          updateStatus("Summarizing...", "info");

          chrome.runtime.sendMessage(
            { action: "summarize", text: selectedText },
            async (response) => {
              startButton.disabled = false;

              if (chrome.runtime.lastError || !response?.summary) {
                updateStatus("Failed to summarize.", "error");
                return;
              }

              // Show the summary to the user
              showSummary(response.summary);

              const voice = voiceSelect.value;

              const finalText =
                `${response.summary}\nNow I will read the full content.\n${selectedText}`;

              await playTextWithTTS(finalText, voice);
            }
          );
        }
      );
    } catch (err) {
      updateStatus(`Error: ${err.message}`, "error");
      startButton.disabled = false;
    }
  });
});
