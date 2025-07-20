// Listen for messages from background script
let currentAudio = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "playText" && request.text && request.apiKey) {
    playText(request.text, request.apiKey);
  }
});

// Function to play text using Google TTS
async function playText(text, apiKey) {
  try {
    if (!text || text.trim().length === 0) {
      console.error("No text provided for TTS");
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    // Clean the text to remove any problematic characters
    const cleanText = text
      .replace(/[<>]/g, '') // Remove SSML tags if any
      .replace(/&/g, 'and') // Replace ampersands
      .substring(0, 5000); // Limit to 5000 characters (API limit)

    console.log("Starting TTS for text:", cleanText.substring(0, 50) + "...");
    
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { 
          text: cleanText 
        },
        voice: {
          languageCode: "en-US",
          name: "en-US-Wavenet-D"
        },
        audioConfig: {
          audioEncoding: "MP3",
          pitch: 0,
          speakingRate: 1.25
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("TTS API error details:", errorData);
      throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.audioContent) {
      console.log("Received audio content, attempting playback");
      currentAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      currentAudio.onerror = (e) => {
        console.error("Audio playback error:", e);
        currentAudio = null;
      };
      currentAudio.onended = () => {
        console.log("Playback completed");
        currentAudio = null;
      };
      await currentAudio.play();
      console.log("Playback started successfully");
    } else {
      console.error("TTS failed - no audio content:", data);
    }
  } catch (error) {
    console.error("Error in TTS:", error);
    currentAudio = null;
  }
}