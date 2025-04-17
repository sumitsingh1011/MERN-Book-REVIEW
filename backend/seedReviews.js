const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Book = require('./models/Book');   // Adjust the path as needed
const User = require('./models/User');   // Adjust the path as needed
const Review = require('./models/Review'); // Adjust the path as needed

// Replace with your MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://bhuvankumarsbk798:T0m4rMY4EHcOkNEi@book-review-platform.vpa9b.mongodb.net/?retryWrites=true&w=majority&appName=book-review-platform' ;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Remove existing reviews (if any)
    await Review.deleteMany({});
    console.log('Existing reviews removed.');

    // Fetch all books and users
    const books = await Book.find({});
    const users = await User.find({});

    if (books.length === 0) {
      console.log("No books found to create reviews for.");
      return;
    }

    if (users.length === 0) {
      console.log("No users found to associate reviews with.");
      return;
    }

    const reviews = [];
    
    // For each book, create a random number of reviews (between 1 and 5)
    for (const book of books) {
      const reviewCount = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < reviewCount; i++) {
        // Pick a random user from the list
        const randomUser = users[Math.floor(Math.random() * users.length)];
        // Generate a random rating between 1 and 5
        const rating = faker.number.int({ min: 1, max: 5 });
        // Generate a random comment
        const comment = faker.lorem.sentence();

        reviews.push({
          book: book._id,
          user: randomUser._id,
          rating,
          comment,
        });
      }
    }

    await Review.insertMany(reviews);
    console.log(`${reviews.length} reviews inserted successfully.`);
  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    mongoose.connection.close();
  }
});
