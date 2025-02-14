import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../features/books/booksSlice';
import { Spinner, Alert, Card, Container, Row, Col, Form } from 'react-bootstrap';
import { setSearchTerm } from '../features/search/searchSlice';

const BookList = () => {
  const dispatch = useDispatch();
  const { books, status, error } = useSelector((state) => state.books);
  const { searchTerm } = useSelector((state) => state.search); // Get search term from Redux
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(6); // Number of books per page

  // Fetch books on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Display loading state
  if (status === 'loading') {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading books...</p>
      </Container>
    );
  }

  // Display error state
  if (status === 'failed') {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
        </Alert>
      </Container>
    );
  }

  // Display message if no books are found
  if (filteredBooks.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">No books found matching your search.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Search Bar */}
      <Form className="mb-4">
        <Form.Control
          type="search"
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))} // Update Redux state
        />
      </Form>

      {/* Book Grid */}
      <Row>
        {currentBooks.map((book) => (
          <Col key={book._id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <img
                src={book.coverImage || 'https://via.placeholder.com/300x200'} // Fallback image
                alt={book.title}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  By {book.author}
                </Card.Subtitle>
                <Card.Text>{book.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }).map(
            (_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  onClick={() => paginate(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
    </Container>
  );
};

export default BookList;