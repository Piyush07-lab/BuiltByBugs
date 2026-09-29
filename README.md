# BuiltByBugs Portfolio

A full-stack personal portfolio and showcase repository built by Piyush.

## 🚀 Architecture

The project is structured into independent frontend and backend services:

* **Frontend:** A modern, responsive React application built with Vite and styled using TailwindCSS. Located in `root/frontend`.
* **Backend:** A Node.js API server connected to MongoDB for data persistence, integrating with the Gemini API for advanced AI features. Located in `root/backend`.

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4, Three.js, Headless UI
- **Backend:** Node.js, MongoDB, Google GenAI SDK

## 📦 Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB

### Running Locally

Each service is self-contained with its own `package.json`:

1. **Install dependencies:**
   ```bash
   # Frontend
   cd root/frontend && npm install

   # Backend
   cd ../backend && npm install
   ```

2. **Run the frontend development server:**
   ```bash
   cd root/frontend
   npm run dev
   ```

3. **Start the backend server:**
   ```bash
   cd root/backend
   npm start
   ```

## 📝 License
This project is currently unlicensed.
