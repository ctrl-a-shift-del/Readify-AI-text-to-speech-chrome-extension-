const HF_API_KEY = "your_huggingface_api_key_here";
const GOOGLE_TTS_API_KEY = "your_google_tts_api_key_here";

// Create context menus on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "readify-read-text",
    title: "Read",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.create({
    id: "readify-summarize-text",
    title: "Summarize",
    contexts: ["selection"]
  });
});

// Handle right-click menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!info.selectionText) return;
  
  if (info.menuItemId === "readify-read-text") {
    chrome.tabs.sendMessage(tab.id, {
      action: "playText",
      text: info.selectionText,
      apiKey: GOOGLE_TTS_API_KEY
    });
  } 
  else if (info.menuItemId === "readify-summarize-text") {
    handleSummarization(info.selectionText)
      .then(summary => {
        chrome.tabs.sendMessage(tab.id, {
          action: "playText",
          text: summary.summary,
          apiKey: GOOGLE_TTS_API_KEY
        });
      })
      .catch(error => {
        console.error("Summarization failed:", error);
      });
  }
});

// Handle summarization requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    handleSummarization(request.text)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ summary: "Error: " + error.message }));
    return true;
  }
});

async function handleSummarization(text) {
  if (!HF_API_KEY) throw new Error("API key not set.");
  if (text.length < 50) return { summary: "Text too short to summarize effectively." };
  if (text.length > 5000) text = text.substring(0, 5000) + "...";

  const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } })
  });

  if (!response.ok) throw new Error("Failed to summarize: " + response.status);
  const result = await response.json();
  const summary = result?.[0]?.summary_text || result?.summary_text || "Couldn't generate summary.";
  return { summary: formatSummary(summary) };
}

function formatSummary(summary) {
  if (!summary || summary === "Couldn't generate summary.") return summary;
  let cleanSummary = summary.trim()
    .replace(/^(This (content|article|text|passage) is about|The (content|article|text|passage) discusses?|This discusses?)/i, '')
    .replace(/^[.,:\\s]+/, '');
  if (cleanSummary.length > 0)
    cleanSummary = cleanSummary.charAt(0).toLowerCase() + cleanSummary.slice(1);
  return `This content is about ${cleanSummary}`;
}