import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { setSearchTerm } from '../features/search/searchSlice';

const CustomNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { searchTerm } = useSelector((state) => state.search);
  const userId = user ? (user._id || user.id) : null;

  const handleLogout = () => {
    try {
      dispatch(logout());
      localStorage.removeItem('token'); // Clear token from storage
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    dispatch(setSearchTerm(value));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setSearchTerm(searchInput.trim()));
      navigate('/books');
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || '?';
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm fixed-top">
      <Container fluid>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <span className="me-2" role="img" aria-label="book">📚</span>
          Book Review Platform
        </Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="navbar-collapse" />

        {/* Navbar Content */}
        <Navbar.Collapse id="navbar-collapse">
          {/* Search Bar */}
          <Form 
            className="d-flex mx-auto my-2 my-lg-0" 
            onSubmit={handleSearchSubmit}
          >
            <Form.Control
              type="search"
              placeholder="Search books..."
              className="me-2"
              aria-label="Search"
              value={searchInput}
              onChange={handleSearchChange}
              style={{ minWidth: '300px' }}
            />
            <Button 
              variant="outline-primary" 
              type="submit"
              disabled={!searchInput.trim()}
            >
              Search
            </Button>
          </Form>

          {/* Navigation Links */}
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="mx-2">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/books" className="mx-2">
              Books
            </Nav.Link>

            {/* Conditional Profile/Login Links */}
            {isAuthenticated && user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-profile"
                  className="d-flex align-items-center"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="rounded-circle me-2"
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        objectFit: 'cover' 
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle me-2 bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: '30px', height: '30px' }}
                    >
                      {getInitials(user.username)}
                    </div>
                  )}
                  <span>{user.username}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                   
                  <Link to={`/profile/${userId}`}>Profile</Link>
                  
                  <Dropdown.Item as={Link} to="/settings">
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    onClick={handleLogout}
                    className="text-danger"
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  className="me-2"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;