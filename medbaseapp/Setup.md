Medbase is a real-time Patient Management System built with React and PGlite (PostgreSQL in IndexedDB). It allows seamless CRUD operations with cross-tab synchronization, ensuring data consistency. Features include search, filtering, and responsive UI.

Setup and Usage Instructions

---

1. # Prerequisites

   Node.js (v16 or higher)
   React (v18+)
   @electric-sql/pglite for IndexedDB-based PostgreSQL

2. # Installation

## Clone the repository

git clone https://github.com/Ajash2003/MedBase.git
cd medbaseapp

## Install dependencies:

npm install

## Set up the database

npm install @electric-sql/pglite
The app uses PGlite (PostgreSQL in IndexedDB).
No external database setup is needed.

## Run the development server

npm run dev

App will be available at http://localhost:3000
