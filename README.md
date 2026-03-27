# MERN Product Integration

This project demonstrates React and Express integration using Axios, Bootstrap, and MongoDB-style product APIs.

## Project Structure

- `backend/` contains the Express API, MongoDB model, seed data, and REST endpoints.
- `backend/frontend/` contains the React frontend built with Vite, Axios, and Bootstrap.

## Backend Features

- `GET /api/products` returns product data from MongoDB when connected, otherwise seeded mock data.
- `GET /api/products/summary` returns dashboard metrics for cards on the frontend.
- `GET /api/products/dashboard` returns product data and summary metrics in one response.
- `GET /api/products/:id` returns a single product by MongoDB id.
- `POST /api/products` creates a new product when MongoDB is connected.
- Query support on `/api/products`: `category`, `search`, `sort`
- `GET /api/health` verifies API and database status.

## Frontend Features

- Responsive Bootstrap product grid
- Axios integration with Express API
- Loading spinner while fetching data
- Error alert for failed requests
- Professional dashboard layout and summary cards

## Setup

### 1. Configure environment files

Create `backend/.env` from `backend/.env.example`.

Create `backend/frontend/.env` from `backend/frontend/.env.example`.

### 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd backend/frontend
npm install
```

### 3. Add MongoDB connection

Set `MONGO_URI` in `backend/.env`.

If you want to seed MongoDB after adding the URI:

```bash
cd backend
npm run seed
```

### 4. Start the application

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd backend/frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and expects the backend on `http://localhost:5000`.
