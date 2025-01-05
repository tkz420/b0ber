import React, { useState, useEffect } from 'react';
    import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

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
          setItems([...items, newItem]);
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

      useEffect(() => {
        const storedItems = localStorage.getItem('galleryItems');
        if (storedItems) {
          const items = JSON.parse(storedItems);
          const foundItem = items.find((item) => item.id === parseInt(id));
          setItem(foundItem);
        }
      }, [id]);

      const handleBackClick = () => {
        navigate('/');
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
              <button onClick={handleBackClick}>&lt;&lt;</button>
              <button onClick={handleBackClick}>&gt;&gt;</button>
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
      return (
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/:id" element={<DetailPage />} />
        </Routes>
      );
    }

    export default App;
