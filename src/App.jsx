import React, { useState, useEffect } from 'react';
    import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
    import { Navbar, Container, Nav } from 'react-bootstrap';
    import 'bootstrap/dist/css/bootstrap.min.css';

    function Gallery() {
      const [items, setItems] = useState(() => {
        const storedItems = localStorage.getItem('galleryItems');
        return storedItems ? JSON.parse(storedItems) : [];
      });
      const [nextId, setNextId] = useState(() => {
        const storedItems = localStorage.getItem('galleryItems');
        const parsedItems = storedItems ? JSON.parse(storedItems) : [];
        return parsedItems.length > 0 ? Math.max(...parsedItems.map(item => item.id)) + 1 : 1;
      });
      const [newLink, setNewLink] = useState('');
      const navigate = useNavigate();

      useEffect(() => {
        localStorage.setItem('galleryItems', JSON.stringify(items));
      }, [items]);

      const addItem = () => {
        if (newLink.trim() !== '') {
          const newItem = {
            id: nextId,
            link: newLink,
            uploader: 'anonymous',
            uploadTime: new Date().toISOString(),
          };
          setItems([newItem, ...items]);
          setNextId(nextId + 1);
          setNewLink('');
        }
      };

      const handleItemClick = (id) => {
        navigate(`/${id}`);
      };

      return (
        <div>
          <div className="add-item-form">
            <input
              type="text"
              placeholder="Enter image or video link"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
            <button onClick={addItem}>Add Item</button>
          </div>
          <div className="gallery">
            {items.map((item) => (
              <div
                key={item.id}
                className="gallery-item"
                onClick={() => handleItemClick(item.id)}
              >
                <span className="item-id">{item.id}</span>
                {item.link.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <img src={item.link} alt={`Item ${item.id}`} />
                ) : (
                  <video src={item.link} />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    function DetailPage() {
      const { id } = useParams();
      const navigate = useNavigate();
      const [item, setItem] = useState(null);
      const [items, setItems] = useState(() => {
        const storedItems = localStorage.getItem('galleryItems');
        return storedItems ? JSON.parse(storedItems) : [];
      });

      useEffect(() => {
        const storedItems = localStorage.getItem('galleryItems');
        if (storedItems) {
          const items = JSON.parse(storedItems);
          setItems(items);
          const foundItem = items.find((item) => item.id === parseInt(id));
          setItem(foundItem);
        }
      }, [id]);

      const handleBackClick = () => {
        navigate('/');
      };

      const handlePrevClick = () => {
        const currentIndex = items.findIndex((item) => item.id === parseInt(id));
        if (currentIndex > 0) {
          navigate(`/${items[currentIndex - 1].id}`);
        }
      };

      const handleNextClick = () => {
        const currentIndex = items.findIndex((item) => item.id === parseInt(id));
        if (currentIndex < items.length - 1) {
          navigate(`/${items[currentIndex + 1].id}`);
        }
      };

      const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString();
      };

      if (!item) {
        return (
          <div className="detail-page">
            <p>Item not found</p>
            <button onClick={handleBackClick}>Back to Gallery</button>
          </div>
        );
      }

      return (
        <div className="detail-page">
          <div className="detail-page-content">
            <div className="detail-page-media">
              {item.link.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <img src={item.link} alt={`Item ${item.id}`} />
              ) : (
                <video src={item.link} controls />
              )}
            </div>
            <div className="detail-page-nav">
              <button onClick={handlePrevClick}>&lt;&lt;</button>
              <button onClick={handleNextClick}>&gt;&gt;</button>
            </div>
            <div className="detail-page-info">
              <div>{item.id}</div>
              <div>{item.uploader}</div>
              <div>{formatTime(item.uploadTime)}</div>
              <div>&gt;tfw</div>
            </div>
          </div>
        </div>
      );
    }

    function App() {
      const navigate = useNavigate();
      const location = useLocation();
      const [items, setItems] = useState(() => {
        const storedItems = localStorage.getItem('galleryItems');
        return storedItems ? JSON.parse(storedItems) : [];
      });

      const handleLogoClick = () => {
        navigate('/');
      };

      const handleIdClick = (id) => {
        navigate(`/${id}`);
      };

      return (
        <div>
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand onClick={handleLogoClick} style={{cursor: 'pointer'}}>b0ber</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link onClick={() => navigate('/about')}>About</Nav.Link>
                <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
                <Nav.Link onClick={() => navigate('/random')}>Random</Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          {location.pathname === '/' && (
            <div className="id-navigation">
              {items.map((item) => (
                <button key={item.id} onClick={() => handleIdClick(item.id)}>
                  {item.id}
                </button>
              ))}
            </div>
          )}
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/:id" element={<DetailPage />} />
            <Route path="/about" element={<p>About Page</p>} />
            <Route path="/login" element={<p>Login Page</p>} />
             <Route path="/random" element={<p>Random Page</p>} />
          </Routes>
        </div>
      );
    }

    export default App;
