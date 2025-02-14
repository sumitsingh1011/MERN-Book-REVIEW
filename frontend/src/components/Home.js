import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../features/books/booksSlice';
import { Link } from 'react-router-dom';
import { Carousel, Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

const Home = () => {
  const dispatch = useDispatch();
  const { books, status, error } = useSelector((state) => ({
    books: state.books.books || [], // Default to empty array
    status: state.books.status,
    error: state.books.error,
  }));

  // Fetch books on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);

  // Display loading state
  if (status === 'loading') {
    return (
      <Container className="mt-4 text-center">
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

  // Display message if no books are available
  if (!books || books.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">No books available.</Alert>
      </Container>
    );
  }

  // Get featured books (first 3 books for example)
  const featuredBooks = books.slice(0, 3);

  return (
    <Container className="mt-4">
      {/* Featured Books Carousel */}
      <h2 className="mb-4">Featured Books</h2>
      <Carousel className="mb-5">
        {featuredBooks.map((book) => (
          <Carousel.Item key={book._id}>
            <img
              className="d-block w-100"
              src={book.coverImage || 'https://via.placeholder.com/800x400'} // Fallback image
              alt={book.title}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <Carousel.Caption className="bg-dark bg-opacity-75 p-3 rounded">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <Link to={`/books/${book._id}`} className="btn btn-primary">
                View Details
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* All Books Grid */}
      <h2 className="mb-4">All Books</h2>
      <Row>
        {books.map((book) => (
          <Col key={book._id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <img
                src={book.coverImage || 'https://via.placeholder.com/300x200'} // Fallback image
                alt={book.title}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  By {book.author}
                </Card.Subtitle>
                <Card.Text className="flex-grow-1">{book.description}</Card.Text>
                <Link to={`/books/${book._id}`} className="btn btn-primary mt-auto">
                  View Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;