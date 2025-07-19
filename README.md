![Readify Banner](./banner.jpg)

# Readify – AI-Powered Reading Companion (A Website Extension)

> Developed during the initial sprint of ProtoSem 2025, a project-based industry immersion conducted by Forge.

---

## 🧠 Overview

**Readify** is a smart Chrome extension that brings **AI-based reading and summarization** to your browser. Just **select any text** from a web page, and Readify will **summarize it using Hugging Face BART**, and **read it aloud** using Google’s neural text-to-speech with **realistic human voices**. 
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
- **Natural Human-like Voice** powered by Google TTS (not robotic!)
- **Voice Model Selection**: Choose between Indian, US, UK, and Aussie voices 
- **Instant one-click interaction** – no page reloads or switching tabs
- **Minimal popup UI** with real-time status and summary feedback
- **Speed Control** 
- **Download MP3 Output**

---

## 🎥 Demo Walkthrough

[![Demo Video](https://img.youtube.com/vi/1Zoh4PMvPv4/0.jpg)](https://www.youtube.com/watch?v=1Zoh4PMvPv4)

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
2. Open Chrome and visit:  
   `chrome://extensions/`
3. Enable **Developer Mode**.
4. Click **“Load Unpacked”** and select the project folder.
5. Pin the extension (optional).
6. Go to any webpage → select text → click the extension → hit **START READING**.

---

## ⚙️ How It Works

1. You **highlight** any paragraph or block of text on a webpage.
2. Click the **Readify** extension icon and press **START READING**.
3. The extension sends the text to Hugging Face → gets a **summary**.
4. The summary + full text are sent to Google TTS.
5. The audio is played in-browser using a voice of your choice.

Behind the scenes:
- `background.js`: Handles AI summarization via API
- `content.js`: Extracts webpage text and coordinates
- `popup.js`: Manages UI logic and TTS playback

---

## 📁 File Structure

- background.js # Hugging Face summarizer (async handler)
- content.js # Full-page content parser & TTS handler
- popup.html # Minimal UI for settings & start button
- popup.js # Logic for reading & summary playback
- style.css # All popup UI styles
- manifest.json # Extension configuration (v3)
- logo.png # Extension icon

---

## 🧑‍🤝‍🧑 Team & Contributions

> **Team Name**: `Reado-gram`  

| Name               | Contributions                                          |
|--------------------|--------------------------------------------------------|
| **Shailendra C**   | Team lead, bug fixes, GitHub, feature integration      |
| **Naveen**         | AI feature support, presentation                       |
| **Yadesh**         | Feature addition, tech support                         |
| **Takshak**        | Feature addition, tech support                         |
| **Santhiya**       | UI design and frontend, testing, feature addition      |
| **Nivetha**        | UI assistance and frontend, testing, feature addition  |

---

## 🚀 Future Enhancements

- 🧾 **PDF reading support**
- 🌐 **Multilingual summarization & TTS**
- 🧠 **Alternative summarization models (Gemini, T5, GPT)**

---

## ⚠️ License

This is an academic prototype built under Forge ProtoSem 2025.  
**No license granted.**  Do not copy, reuse, or publish without prior permission from the team.

---

## 📬 Contact

For questions, suggestions or showcasing:

- **Shailendra Chandrasekaran**    
[LinkedIn](https://linkedin.com/in/shailendrachandrasekaran)  

---
