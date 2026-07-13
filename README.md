# 💰 AI Powered Debt Relief & Financial Recovery Platform

<p align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.138-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.14-blue?logo=python)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue?logo=sqlite)
![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

# 📌 Project Overview

The **AI Powered Debt Relief & Financial Recovery Platform (FinRelief AI)** is an AI-driven financial assistance web application that helps users manage debt, evaluate their financial health, and receive intelligent debt settlement recommendations.

The application combines **Artificial Intelligence**, **Financial Analytics**, and **Modern Web Technologies** to generate personalized debt negotiation strategies, professional settlement letters, and financial recovery recommendations.

Developed as part of the **Google Cloud Generative AI Internship Program**, the platform demonstrates the integration of **React**, **FastAPI**, **SQLite**, and **Google Gemini AI** to build a complete full-stack AI application.

---

# 🚀 Live Application

### 🌐 Frontend

👉 https://ai-powered-debt-relief-financial-re-livid.vercel.app

### ⚙️ Backend API

👉 https://ai-powered-debt-relief-financial-3z1x.onrender.com

### 📖 Swagger API Documentation

👉 https://ai-powered-debt-relief-financial-3z1x.onrender.com/docs

---

# 📸 Screenshots

| Login | Dashboard |
|--------|-----------|
| ![](Project%20Development%20Phase/assets/screenshots/login.png) | ![](Project%20Development%20Phase/assets/screenshots/dashboard.png) |

| AI Strategy | Settlement |
|-------------|------------|
| ![](Project%20Development%20Phase/assets/screenshots/ai-strategy.png) | ![](Project%20Development%20Phase/assets/screenshots/settlement.png) |

---

# ✨ Features

## 👤 User Management

- User Registration
- Secure Login
- JWT Authentication
- User Profile Management

---

## 💳 Loan Management

- Add Loan Details
- Update Loan Information
- Delete Loans
- View Outstanding Loans
- Debt Tracking

---

## 📊 Financial Health Analysis

- Monthly Income Analysis
- Monthly Expense Tracking
- Savings Overview
- Debt Summary
- Financial Dashboard

---

## 🤖 AI Powered Features

- AI Debt Negotiation Strategy
- Personalized Financial Recommendations
- Settlement Percentage Suggestion
- Professional Settlement Letter Generation
- Google Gemini AI Integration
- Intelligent Fallback Recommendation Engine

---

## 📜 Recommendation History

- Store AI Recommendations
- View Previous Recommendations
- Track Financial Recovery Progress

---

# 🛠 Technology Stack

| Layer | Technology |
|---------|------------|
| Frontend | React.js, HTML, CSS, JavaScript |
| Backend | FastAPI, Python |
| Database | SQLite, SQLAlchemy ORM |
| AI | Google Gemini API |
| Authentication | JWT |
| API Testing | Swagger UI |
| Version Control | Git, GitHub |
| Deployment | Render, Vercel |

---

# 🏗️ System Architecture

```
                User
                  │
                  ▼
      React Frontend (Vercel)
                  │
          REST API Requests
                  │
                  ▼
      FastAPI Backend (Render)
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
 Google Gemini AI       SQLite Database
```

---

# 📂 Project Structure

```text
AI-Powered-Debt-Relief-Financial-Recovery-Platform
│
├── 1. Brainstorming & Ideation
├── 2. Requirement Analysis
├── 3. Project Design Phase
├── 4. Project Planning Phase
├── 5. Project Development Phase
│
│   ├── backend
│   │   ├── database
│   │   ├── models
│   │   ├── routers
│   │   ├── schemas
│   │   ├── services
│   │   ├── utils
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── finrelief.db
│   │
│   └── frontend
│       ├── public
│       ├── src
│       ├── package.json
│       └── vite.config.js
│
├── 6. Project Testing
├── 7. Project Documentation
└── 8. Project Demonstration
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/bkvarma07/AI-Powered-Debt-Relief-Financial-Recovery-Platform.git

cd AI-Powered-Debt-Relief-Financial-Recovery-Platform
```

---

## Backend Setup

```bash
cd "5. Project Development Phase/backend"

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file inside the backend folder.

```env
GOOGLE_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
```

Run the backend.

```bash
uvicorn main:app --reload
```

Backend

```
http://127.0.0.1:8000
```

Swagger API

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

```bash
cd "../frontend"

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# ☁️ Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | SQLite (Local Storage) |
| AI Model | Google Gemini 2.5 Flash |
| Version Control | GitHub |

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Protected API Routes
- Environment Variable Management
- Secure CORS Configuration

---

# 📈 Future Enhancements

- PostgreSQL Cloud Database
- Credit Score Prediction
- Banking API Integration
- Email Notifications
- PDF Report Generation
- Multi-language Support
- Mobile Application
- AI Financial Advisor Chatbot

---

# 👨‍💻 Contributors

- **Bade Kalyan**
- **Harsha Pothireddy**

Developed as part of the **Google Cloud Generative AI Internship Program**.

---

# ⚠️ Disclaimer

This project was developed for educational and internship purposes. It demonstrates AI-powered financial assistance concepts and should not be considered professional financial or legal advice.

---

# ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is released under the **MIT License** and is intended for educational and learning purposes.