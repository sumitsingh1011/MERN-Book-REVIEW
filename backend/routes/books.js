const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('reviews');
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new book (admin only)
router.post('/', async (req, res) => {
  const book = new Book(req.body);
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const books = await Book.find().skip(skip).limit(limit);
      const totalBooks = await Book.countDocuments();
  
      res.json({
        books,
        totalPages: Math.ceil(totalBooks / limit),
        currentPage: page
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;