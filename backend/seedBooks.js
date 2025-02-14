// seedBooks.js
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Book = require('./models/Book'); // Adjust path as necessary

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
    // Optionally, clear existing books
    await Book.deleteMany({});
    console.log('Existing books removed.');

    const books = [];
    const numberOfBooks = 50; // Change to 100 if needed

    for (let i = 0; i < numberOfBooks; i++) {
      const book = new Book({
        title: faker.lorem.words(3),
        author: faker.person.fullName(), // Updated API: use fullName instead of findName
        description: faker.lorem.sentences(3),
        // Use picsum.photos to get a random cover image.
        coverImage: `https://picsum.photos/200/300?random=${i}`,
      });
      books.push(book);
    }

    await Book.insertMany(books);
    console.log(`${numberOfBooks} books inserted successfully.`);
  } catch (error) {
    console.error('Error seeding books:', error);
  } finally {
    mongoose.connection.close();
  }
});
