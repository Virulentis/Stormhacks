# TCG Card Finder (Stormhacks 2025)

A full-stack application that aggregates TCG Card data (details, prices, stock) and provides search and analytics capabilities.

##  Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS
*   **Backend**: Node.js, Express
*   **Database**: Redis
*   **Infrastructure**: Docker, Docker Compose

##  Prerequisites

*   [Node.js](https://nodejs.org/) (v18+)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/)

##  Getting Started

### 1. Start Background Services
Start the Redis database and Backend API using Docker.

```bash
cd storm-hacks-2025
docker-compose up -d --build
```

### 2. Seed Database
Populate Redis with the initial card data.

```bash
# In another terminal window
cd storm-hacks-2025/backend
npm install
node seed.js
```

### 3. Run Frontend
Start the web interface.

```bash
# In storm-hacks-2025/frontend
npm install
npm run dev
```

Visit the application at: [http://localhost:5173](http://localhost:5173)  
API Server is running at: [http://localhost:3001](http://localhost:3001)

##  Screenshots

### Architecture Diagram
<img width="641" height="601" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/a46a26e5-a657-42cd-bfe3-6f34d123d8c0" />

### UI Preview
<img width="1272" height="974" alt="UI Screenshot" src="https://github.com/user-attachments/assets/c1b3f039-71e5-4437-885b-40a927b6f852" />
