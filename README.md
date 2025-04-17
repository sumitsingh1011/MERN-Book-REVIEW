A full-stack book review platform where users can browse books, read and write reviews, and rate books. Built with React (frontend) and Node.js (backend) using Express and MongoDB.

Features
Frontend:
Home page with featured books.
Book listing page with search and filter functionality.
Individual book page with details and reviews.
User profile page.
Review submission form.
Backend:
RESTful API for managing books, reviews, and users.
Data validation and error handling.
MongoDB for data persistence.
Technologies Used
Frontend: React, Redux Toolkit, React Router, Axios, Bootstrap.
Backend: Node.js, Express, MongoDB, Mongoose.
Tools: Postman (for API testing), Git (for version control).
Setup Instructions
Prerequisites
Node.js (v16 or higher)
MongoDB (local or cloud instance)
Git (optional)
Backend Setup
Clone the repository:
git clone https://github.com/your-username/book-review-platform.git
cd book-review-platform/backend
Install dependencies:
npm install
Create a .env file in the backend folder and add your MongoDB connection string:
MONGO_URI=mongodb://localhost:27017/book-review-platform
PORT=5000
Start the backend server:
npm start
The backend will run on http://localhost:5000.
Frontend Setup
Navigate to the frontend folder:
cd ../frontend
Install dependencies:
npm install
Start the frontend development server:
npm start
The frontend will run on http://localhost:3000.
Database Setup
Ensure MongoDB is running locally or update the .env file with your cloud MongoDB connection string.
API Endpoints
Books:
GET /books - Retrieve all books (with pagination).
GET /books/:id - Retrieve a specific book.
POST /books - Add a new book (admin only).
Reviews:
GET /reviews?bookId=BOOK_ID - Retrieve reviews for a book.
POST /reviews - Submit a new review.
Users:
GET /users/:id - Retrieve user profile.
PUT /users/:id - Update user profile.
