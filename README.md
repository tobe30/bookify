# Bookify

Bookify is a final-year book store management system built as a full-stack web application. It consists of a React + Vite frontend and an Express + MongoDB backend. The system supports user authentication, book browsing, cart management, order checkout, admin management, and Paystack card payments.

## Project Overview

This project models a university book store with the following capabilities:

- Student authentication and profile management
- Browse available books, categories, and book details
- Add books to cart and update quantities
- Checkout with delivery information and payment via cards
- Save delivery address for future orders
- Admin panels for managing books, users, and orders
- Paystack payment initialization and verification support

## Why it exists

The application is designed as a final-year project for a book store management system. It demonstrates:

- modern frontend architecture with React, React Router, and TanStack Query
- backend API design with Node.js, Express, and MongoDB
- secure cookie-based authentication
- stateful shopping cart and checkout workflows
- integration with payment gateways

## Folder structure

- `backend/` - Express server, API routes, controllers, and MongoDB models
- `frontend/` - React UI built with Vite, Tailwind CSS, and React Query

### Backend structure

- `backend/controllers/` - business logic for auth, books, cart, orders, payments, users
- `backend/models/` - Mongoose schemas for `User`, `Book`, `Order`
- `backend/routes/` - Express routes for API endpoints
- `backend/lib/` - shared helpers for database and Cloudinary
- `backend/middleware/` - authentication and authorization middleware
- `backend/server.js` - main Express server entrypoint

### Frontend structure

- `frontend/src/pages/` - page-level components for home, books, checkout, dashboard, login, etc.
- `frontend/src/components/` - shared UI components like `Navbar`, `BookCard`, `ProtectedRoute`
- `frontend/src/context/` - cart state provider and hooks
- `frontend/src/lib/` - API helpers and Axios instance
- `frontend/src/routes/` - route definitions for public, user, and admin areas

## Key features

### Authentication

- Users register and login with email and password
- JWT cookie-based auth is used on the backend
- `protectRoute` middleware ensures authenticated routes are protected
- frontend caches current user data using React Query under `['authUser']`

### Book browsing

- Books are fetched from `/api/books`
- Each book card shows title, author, price, stock status, and add/remove buttons
- Out-of-stock books are disabled in the UI

### Cart and checkout

- Cart state is managed in `frontend/src/context/CartProvider.jsx`
- Users can increment, decrement, or remove items
- The checkout page pre-fills saved user delivery details when available
- Orders are placed through `/api/orders`

### Payment integration

- Paystack is integrated through backend payment routes:
  - `POST /api/payments/initialize`
  - `GET /api/payments/verify`
- Frontend uses `initializePaystack()` to start card payments
- After payment initialization, the user is redirected to Paystack

### Admin tools

- Admin routes and components allow management of books, users, and orders
- Admin-only pages are protected by role-based checks

## How it works

### App flow

1. User signs in or registers
2. The frontend fetches the current user with `/api/auth/me`
3. Books are loaded from `/api/books`
4. User adds items to cart and views cart totals
5. Checkout form pre-fills saved profile and address data
6. User submits the order and chooses payment method
7. If using card payment, Paystack is initialized via backend
8. Orders are created and delivery info is saved when requested

### API architecture

- `backend/server.js` mounts API routes under `/api`
- `auth.routes.js` handles login, registration, logout, and current user retrieval
- `book.routes.js` serves book data and admin book management
- `cart.routes.js` manages cart state for authenticated users
- `order.routes.js` handles order creation and retrieval
- `payment.routes.js` integrates with Paystack initialization and verification
- `user.routes.js` provides user-specific data for dashboards and admin actions

## Setup and installation

### Backend

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required values
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```

## Environment variables

### Backend `.env`

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - JWT secret for auth cookie signing
- `PAYSTACK_SECRET_KEY` - Paystack secret key for payments
- `FRONTEND_BASE_URL` - frontend base URL for callback URLs

### Frontend `.env`

- `VITE_API_BASE_URL` - backend API base URL (example: `http://localhost:5000/api`)

## Running the system

- Start MongoDB
- Run backend with `npm run dev`
- Run frontend with `npm run dev`
- Navigate to the frontend URL shown by Vite, usually `http://localhost:5173`

## Notes for final year demonstration

- Focus on the end-to-end workflow: signup/login → browse books → add to cart → checkout → payment
- Show the admin section for managing book inventory and orders
- Explain how Paystack integration works from frontend initialization through backend verification
- Highlight how cart state persists in the app while using React Context and React Query

## Development tips

- Keep `authUser` cached through React Query to avoid repeated auth calls
- Use `axiosInstance` with `withCredentials: true` so cookies are sent automatically
- Verify backend CORS is configured for `http://localhost:5173`

## Contact

This project is the Bookify final-year book store management system. Adjust the environment variables and payment settings before deploying or demonstrating.
