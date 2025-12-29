#  Cortex AI - Intelligent Chat Ecosystem

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-000000?style=for-the-badge&logo=react)
![AI Powered](https://img.shields.io/badge/AI-Powered-FF4F00?style=for-the-badge)
![RAG Architecture](https://img.shields.io/badge/Architecture-RAG-blue?style=for-the-badge)

**Cortex AI** is a next-generation chat application designed to mimic human-like memory. Unlike traditional chatbots that forget context once a session ends, Cortex utilizes **Retrieval Augmented Generation (RAG)** to retain long-term context across different conversations, making it your true digital "Second Brain."

---

## 📂 Project Architecture

The project is divided into two distinct parts:

```bash
Cortex-AI/
├── backend/         # The Brain (API, AI Logic, Vector DB)
└── frontend/        # The Interface (UI/UX - Coming Soon)

---
---

---

## 🛡️ Backend (The Brain)

The backend is the powerhouse of Cortex AI. It handles real-time communication, manages vector embeddings for memory, and connects with high-performance LLMs.

### 🛠️ Backend Technologies

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink)

![Pinecone](https://img.shields.io/badge/PINECONE-VECTOR_DB-blue?style=for-the-badge)
![Groq](https://img.shields.io/badge/GROQ_AI-LLAMA_3-F55036?style=for-the-badge)
![Xenova](https://img.shields.io/badge/XENOVA-LOCAL_EMBEDDINGS-FFD21E?style=for-the-badge)

### 📂 Backend Folder Structure

```bash
Cortex-AI/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  │  ├─ auth.controller.js
│  │  │  └─ chat.controller.js
│  │  ├─ db/
│  │  │  └─ db.js
│  │  ├─ middleware/
│  │  │  └─ auth.middleware.js
│  │  ├─ models/
│  │  │  ├─ chat.model.js
│  │  │  ├─ message.model.js
│  │  │  └─ user.model.js
│  │  ├─ routes/
│  │  │  ├─ auth.route.js
│  │  │  └─ chat.routes.js
│  │  ├─ services/
│  │  │  ├─ ai.service.js
│  │  │  └─ vector.service.js
│  │  ├─ sockets/
│  │  │  └─ socket.server.js
│  │  └─ app.js
│  ├─ .env
│  ├─ .gitignore
│  ├─ package-lock.json
│  ├─ package.json
│  └─ server.js