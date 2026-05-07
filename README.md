# Sample Full-Stack Application

This repository contains a sample full-stack application with a Java backend and React frontend. The application demonstrates user authentication and a multi-step form.

## Structure

- `backend/` — Java Spring Boot backend
- `frontend/` — React frontend using Vite

## Setup

### Backend

1. Navigate to the `backend` directory.
2. Ensure you have Java 11+ and Gradle 8.x installed.
3. Run `./gradlew bootRun` to start the backend server.

### Frontend

1. Navigate to the `frontend` directory.
2. Ensure you have Node.js 14+ and npm installed.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the frontend server.

### Persistent Storage

- User data and form submissions are stored in JSON files located in the `data/` directory.
- Ensure the `data/` directory exists and is writable by the application.

## Purpose

This application is designed to demonstrate a simple full-stack setup with user authentication and form handling.

## Testing

- Backend tests can be run using `./gradlew test` in the `backend` directory.
- Frontend tests can be run using `npm test` in the `frontend` directory.
