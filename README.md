# BuiltByBugs Portfolio

A full-stack personal portfolio and showcase repository built by Piyush.

## 🚀 Architecture

The project is structured into independent frontend and backend services:

* **Frontend:** A modern, responsive React application built with Vite and styled using TailwindCSS. Located in `root/frontend`.
* **Backend:** A Node.js API server connected to MongoDB for data persistence, integrating with the Gemini API for advanced AI features. Located in `root/backend`.
* **AST Tools:** Custom Abstract Syntax Tree tools (via Babel) for inspecting and analyzing code structures, located in the root package scope.

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4, Three.js, Headless UI
- **Backend:** Node.js, MongoDB, Google GenAI SDK
- **Tooling:** Babel (Parser/Traverse/Generator)

## 📦 Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB

### Running Locally

You can run the different environments by navigating to the `root` directory and using the defined npm scripts:

1. **Install all dependencies:**
   ```bash
   cd root
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Run the frontend development server:**
   ```bash
   npm run dev
   ```

3. **Start the backend server:**
   Navigate into the backend and start the manual Node.js server:
   ```bash
   cd root/backend
   npm start
   ```

4. **Run Code Inspector (AST Tools):**
   ```bash
   cd root
   npm run inspect
   ```

## 📝 License
This project is currently unlicensed.
