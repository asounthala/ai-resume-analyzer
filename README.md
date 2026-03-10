# AI Resume Analyzer

An AI-powered full-stack web application that analyzes your resume against any job description and returns structured feedback — including a match score, strengths, gaps, and actionable suggestions — powered by the Anthropic Claude API.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss) ![Anthropic](https://img.shields.io/badge/Anthropic-Claude-orange)

---

## Features

- **PDF & TXT Upload** — Upload your resume directly or paste it as plain text
- **AI-Powered Analysis** — Uses Claude (claude-sonnet-4) to compare your resume against a job description
- **Match Score** — Visual score out of 100 with a color-coded progress bar
- **Structured Feedback** — Clearly organized strengths, gaps, and suggestions
- **Animated Progress Bar** — Real-time loading feedback while Claude processes your request
- **Secure API Handling** — Anthropic API key is kept server-side and never exposed to the client


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Next.js (App Router), TypeScript |
| Styling | Tailwind CSS|
| AI Integration | Anthropic Claude API (`@anthropic-ai/sdk`) |
| PDF Parsing | `pdf2json` (server-side) |
| Deployment | Vercel |


## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root of the project:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

> ⚠️ Never commit this file. It is already included in `.gitignore` by default.

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## Project Structure

```
resume-analyzer/
├── app/
│   ├── page.tsx                  # Main UI — file upload, inputs,results display
│   ├── layout.tsx                # Root layout with font and metadata config
│   └── api/
│       ├── analyze/
│       │   └── route.ts          # POST /api/analyze — calls Anthropic Claude API
│       └── parse-pdf/
│           └── route.ts          # POST /api/parse-pdf — extracts text from PDF uploads
├── public/
├── .env.local                    # Local environment variables (not committed)
└── package.json
```


## How It Works

1. **User uploads a resume** (PDF or TXT) or pastes resume text directly
2. **User pastes a job description** into the text area
3. **Frontend sends both** to `/api/analyze` via a POST request
4. **The API route constructs a prompt** and sends it to Claude with strict JSON output formatting instructions
5. **Claude returns structured feedback** — match score, summary, strengths, gaps, and suggestions
6. **Results are displayed** in a clean, organized UI with color-coded scoring



## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com) | Yes |

---

