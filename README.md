# ZeloraTech Recruitment Pipeline - Full Stack Implementation

## Candidate Information
* **Candidate Name:** Binada Matara Arachchige
* **Role:** Software Engineer Intern
* **Challenge:** Option 3 (Full Stack Task)

---

## Project Overview
This repository contains a full-stack recruitment pipeline application designed to manage candidate workflows through a Kanban-style interface. The implementation focuses on performance, scalability, and a premium developer/user experience, adhering to a strict "no-Tailwind" constraint.

## Architecture & Key Decisions

### Zero-Config Backend
To ensure immediate reviewer accessibility, the backend utilizes an in-memory array database. This removes the overhead of local database configuration (MongoDB/PostgreSQL) while still providing a RESTful API that handles persistent state within the session lifetime.

### Strict CSS Module Compliance
Adhering to HR's constraints, the application uses **CSS Modules** for component-scoped styling. A centralized design system was implemented using CSS variables (tokens) to ensure consistency, high visual fidelity, and easy maintenance without utility-first frameworks.

### Scalable SPA Architecture
The frontend is built as a robust Single Page Application (SPA) shell. While the focus was the Kanban board, the navigation system is fully functional via React Context, demonstrating a production-ready routing and state management pattern that can scale as more modules are added.

### Optimistic UI Updates
To deliver a premium user experience, the application implements optimistic updates. Actions such as drag-and-drop operations or status changes reflect instantly in the UI, with background synchronization to the Node.js backend to minimize perceived latency.

## Premium Features

### 3D WebGL Splash Screen
Upon initialization, the application renders a high-performance 3D geometric network built with **Three.js** and `@react-three/fiber`. This visualization represents the "talent pool" and demonstrates the ability to integrate advanced graphics into modern web interfaces.

### Recruitment Intelligence Assistant (Mock)
The interface includes a "Recruitment Intelligence Assistant" component. This mock integration showcases a sophisticated AI-driven UI pattern, reflecting experience in building agentic systems that assist recruiters in navigating complex datasets efficiently.

## Tech Stack
* **Frontend:** React (Vite), Three.js, CSS Modules, Lucide React.
* **Backend:** Node.js, Express.
* **Orchestration:** Concurrently (to manage multi-process development).

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or higher recommended)
* npm (v9.x or higher)

### Installation
1. Clone the repository.
2. From the root directory, run the following command to install all dependencies for both the frontend and backend:
   ```bash
   npm run install:all
   ```

### Running the Application

#### Unified Command (Recommended)
To start both the frontend and backend development servers simultaneously, use the following command from the root:
```bash
npm run dev
```
* The **Frontend** will be available at: `http://localhost:5173`
* The **Backend** will be available at: `http://localhost:5000`

#### Individual Services (Optional)
If you need to run the services separately for debugging or specific testing:

**Frontend Only:**
```bash
cd frontend
npm run dev
```

**Backend Only:**
```bash
cd backend
npm run dev
```

---

## Assumptions
* **Data Persistence:** Since an in-memory store is used, server restarts will reset the candidate data to the initial seed state.
* **Browser Support:** The application is optimized for modern evergreen browsers (Chrome, Firefox, Safari, Edge) due to the use of WebGL.
* **Styling:** It is assumed that the provided mockups required pixel-perfect adherence, which guided the custom CSS variable mapping.
