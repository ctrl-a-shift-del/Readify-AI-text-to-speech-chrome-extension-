![Readify Banner](./banner.jpg)

# Readify – AI-Powered Reading Companion (A Chrome Extension)

> Developed during the initial sprint of ProtoSem 2025, a project-based industry immersion conducted by Forge.

---

## 🧠 Overview

**Readify** is a smart Chrome extension that brings **AI-based reading and summarization** to your browser. Just **select any text** from a web page or even a PDF, and Readify will **summarize it using Hugging Face BART**, and **read it aloud** using Google’s neural text-to-speech with **realistic human voices**.  
No more robotic tones or wordy paragraphs — just clean, clear, AI-enhanced audio summaries on the go.

---

## 📑 Table of Contents

- [Features](#features)
- [Demo Walkthrough](#demo-walkthrough)
- [Technologies & APIs Used](#technologies--apis-used)
- [Installation](#installation)
- [How It Works](#how-it-works)
- [File Structure](#file-structure)
- [Team & Contributions](#team--contributions)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Contact](#contact)

---

## ✨ Features

- **AI Summarization** using BART Large CNN from Hugging Face
- **PDF Content Support** – select and right-click to listen directly
- **Voice Model Selection** – Choose between Indian, US, UK, Aussie (male and female voices)
- **Natural Human-like Voice** powered by Google TTS (not robotic!)
- **Right-click Shortcut** – instantly read or summarize selected text (no popup needed)
- **Speed Control** – adjust the speed of speech
- **Download MP3 Output** – store and share generated audio
- **Instant One-Click Interaction** – no page reloads or switching tabs
- **Minimal Popup UI** – with real-time status and summary feedback

---

## 🎥 Demo Walkthrough

[![Demo Video](https://img.youtube.com/vi/gaBsIuV1kwY/0.jpg)](https://www.youtube.com/watch?v=gaBsIuV1kwY)

---

## 🧰 Tech Stack

### 🔹 Languages & Tools:
- HTML, CSS, JavaScript
- Chrome Extension APIs (Manifest v3)

### 🔹 APIs Used:
-  **Hugging Face BART Large CNN**  
  → For natural language summarization  
  → Model: `facebook/bart-large-cnn`
  
-  **Google Cloud Text-to-Speech**  
  → Converts summarized and full text into realistic audio using neural voices  
  → MP3 output playback in-browser with speed adjustment

---

## 🛠️ Installation

> ⚠️ Currently for local development only (not yet published to Chrome Web Store)

1. Clone or download this repository.
2. Add your API keys:
   - Replace `your_huggingface_api_key_here` in `background.js` (HF_API_KEY)
   - Replace `your_google_tts_api_key_here` in both `background.js` and `popup.js` (GOOGLE_TTS_API_KEY)
3. Open Chrome and visit:  
   `chrome://extensions/`
4. Enable **Developer Mode**.
5. Click **“Load Unpacked”** and select the project folder.
6. Pin the extension (optional).
7. USAGE: Go to any webpage or PDF → select text →  
   either right-click and choose **"Read" or "Summarize"**,  
   or click the extension and do the same. 

---

## ⚙️ How It Works

1. You **highlight** any paragraph or block of text on a webpage or supported PDF.
2. Either:
   - Click the **Readify** extension icon and press **Read or Summarize**, or  
   - Simply **right-click** and choose **Read** or **Summarize** directly.
3. The extension sends the text to Hugging Face → gets a **summary**.
4. The summary + full text are sent to Google TTS.
5. The audio is played in-browser using a voice of your choice.

(NOTE: Voice and speed settings apply only via the popup. Right-click method uses the default voice and speed.)

Behind the scenes:
- `background.js`: Handles AI summarization via API
- `content.js`: Extracts webpage/PDF text and coordinates
- `popup.js`: Manages UI logic and TTS playback

---

## 📁 File Structure

- `background.js` – Hugging Face summarizer (async handler)
- `content.js` – Full-page content parser & TTS handler
- `popup.html` – Minimal UI for settings & start button
- `popup.js` – Logic for reading & summary playback
- `style.css` – All popup UI styles
- `manifest.json` – Extension configuration (v3)
- `logo.png` – Extension icon

---

## 🧑‍🤝‍🧑 Team & Contributions

> **Team Name**: `Reado-gram`  

| Name               | Contributions                                              |
|--------------------|------------------------------------------------------------|
| **Shailendra C**   | integration, Github, Bug fixes, New feature implementaion  |
| **Naveen**         | Core AI functionality, backend logic, demo prep            |
| **Santhiya**       | frontend design and styling, frontend adjustments          |
| **Nivetha**        | UI and frontend testing and improvements                   |  
| **Yadesh**         | Feature addition, speed adjustment integration             |
| **Takshak**        | Feature addition, voice models integration                 |

---

## 🚀 Future Enhancements

- 🌐 **Multilingual summarization & TTS**
- 🧠 **Alternative summarization models (Gemini, T5, GPT)**

---

## ⚠️ License

This is an academic prototype built under Forge ProtoSem 2025.  
**No license granted.**  Do not copy, reuse, or publish without prior permission from the team.

---

## 📬 Contact

For questions, suggestions or showcasing:

- **Shailendra Chandrasekaran**    [LinkedIn](https://linkedin.com/in/shailendrachandrasekaran)  

---
