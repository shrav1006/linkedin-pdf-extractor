# 🔍 LinkedIn PDF Extractor (Azure OpenAI)

An AI-powered full-stack application that extracts structured profile data from LinkedIn PDF exports using Azure OpenAI.

## 🚀 Features

- Upload LinkedIn profile PDF
- Extracts:
  - Name
  - Headline
  - Location
  - About section
  - Skills
  - Experience
  - Education
- Uses Azure OpenAI for intelligent parsing
- Clean React UI preview
- Robust JSON extraction with fallback handling

---

## 🧠 Tech Stack

**Frontend**
- React (Vite)
- Axios
- Modern responsive UI

**Backend**
- Node.js
- Express.js
- Multer (file upload)
- pdfjs-dist (PDF parsing)
- Azure OpenAI API

---

## ⚙️ Environment Variables

Create `.env` inside backend:

```
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_DEPLOYMENT=your_deployment
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

---

## 🏃‍♂️ Run Locally

### Backend

```
cd backend
npm install
npm run start
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 📌 Future Improvements

- OCR support for scanned PDFs  
- Authentication system  
- Batch profile processing  
- MongoDB storage  

---

## 👩‍💻 Author

**Shravani Tambe**  
B.E. Computer Engineering  
---
Disclaimer:
This repository is an independent implementation created to demonstrate the concepts and technologies I worked with during my internship. It does not contain proprietary company code, internal business logic, or confidential assets.

