# Vehicle Maintenance Scheduler + Notification System


## Overview
This project implements a **Logging Middleware** and a **Vehicle Maintenance Scheduler** with a robust **Notification System** as part of the AffordMed Full Stack / Backend evaluation.

The application demonstrates production-grade practices including structured logging, clean architecture, and scheduled maintenance notifications.

## Features
- **Reusable Logging Middleware** (`Log(stack, level, package, message)`)
- **Vehicle Maintenance Scheduler** with cron jobs
- **Multi-channel Notification System** (In-app + Email simulation)
- Fully integrated with AffordMed Test Server APIs
- Proper error handling and observability

## Tech Stack
- **Backend**: Node.js + Express, MonogoDB(Atlas)
- **Logging**: Custom middleware integrated with AffordMed Log API

## How to Run

### 1. Setup Environment
Ensure you have a `.env` file in the root directory with the following variables:
- `MONGO_URI`: Your MongoDB connection string.
- `TOKEN`: Your AffordMed Access Token.
- `BASE_URL`: `http://4.224.186.213/evaluation-service`

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Microservices
The project uses `nodemon` for a smooth development experience. Open two terminal windows and run:

**Vehicle Maintenance Scheduler (Port 5000)**:
```bash
npm run dev:scheduler
```

**Campus Notifications Backend (Port 5001)**:
```bash
npm run dev:notifications
```

## API Endpoints
- **Scheduler**: `GET /api/scheduling/optimize`
- **Notifications**: `GET /api/notifications/inbox`
