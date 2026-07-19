#  Book Reviews Platform

A full-stack web application that allows users to search for books, read reviews, and manage their own book reviews.

## Features

- Search for books using the Open Library API.
- View book details.
- Read reviews written by other users.
- User registration and login.
- JWT authentication.
- Create, edit, and delete reviews.
- Protected routes for authenticated users.
- Responsive design.

## Technologies Used

### Frontend
- React
- TypeScript
- React Router
- Context API
- CSS

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT
- bcrypt

### External API

- Open Library API

## Project Structure

book-reviews-platform/
│
├── book-reviews-frontend/
└── book-reviews-backend/


## Installation

### Clone the repository
 clone https://github.com/Sabrinaltahan/book-reviews-platform-v2.git


### Frontend
cd book-reviews-frontend
npm install
npm run dev

### Backend
cd book-reviews-backend
npm install
npm run dev


## Environment Variables

Create a `.env` file in the backend folder.

## API Endpoints

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`

### Reviews

- GET `/api/reviews/book/:bookId`
- GET `/api/reviews/my`
- POST `/api/reviews`
- PUT `/api/reviews/:id`
- DELETE `/api/reviews/:id`

## Pages

- Home page
- Search page
- Book details page
- Login
- Register
- My Reviews

## Author

Sabrina Al Tahan

Mittuniversitetet

Web Development with React and TypeScript

# link:

Frontend:

Backend: