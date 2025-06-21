import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './ViewItems.css';
import whiteshirt1 from '../images/1.jpeg';
import whiteshirt2 from '../images/2.jpeg';
import whiteshirt3 from '../images/3.jpg';
import shoes1 from '../images/4.webp';
import shoes2 from '../images/5.avif';
import shoes3 from '../images/6.avif';
import pant1 from '../images/7.webp';
import pant2 from '../images/8.avif';
import pant3 from '../images/9.avif';

const ViewItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  
  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // EmailJS configuration - Replace with your actual values
  const EMAILJS_CONFIG = {
    serviceId: 'service_6v27v7e',        // Replace with your EmailJS service ID
    templateId: 'template_422a9fj',      // Replace with your EmailJS template ID
    publicKey: 'UcI4LAvKdA9thMhCL'         // Replace with your EmailJS public key
  };

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }, []);

  // Static initial items
  const staticItems = [
    {
      id: 'static-1',
      itemName: "Classic White Shirt",
      itemType: "Shirt",
      itemDescription: "A premium cotton white shirt perfect for formal occasions.",
      coverImageUrl: whiteshirt1,
      additionalImageUrls: [whiteshirt2, whiteshirt3],
      isStatic: true
    },
    {
      id: 'static-2',
      itemName: "Running Shoes",
      itemType: "Shoes",
      itemDescription: "Comfortable running shoes with excellent cushioning and support.",
      coverImageUrl: shoes1,
      additionalImageUrls: [shoes2, shoes3],
      isStatic: true
    },
    {
      id: 'static-3',
      itemName: "Denim Jeans",
      itemType: "Pant",
      itemDescription: "Classic blue denim jeans with a comfortable fit.",
      coverImageUrl: pant1,
      additionalImageUrls: [pant2, pant3],
      isStatic: true
    }
  ];

  // Fetch items from backend
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/items');
      
      if (response.ok) {
        const data = await response.json();
        const allItems = [...staticItems, ...data.items];
        setItems(allItems);
      } else {
        console.warn('Backend not available, showing static items only');
        setItems(staticItems);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems(staticItems);
      setError('Could not connect to server. Showing cached items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItemClick = () => {
    navigate('/additems');
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  const openEnquiryModal = () => {
    setShowEnquiryModal(true);
    setShowModal(false);
  };

  const closeEnquiryModal = () => {
    setShowEnquiryModal(false);
    setEnquiryForm({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setEnquiryMessage('');
  };

  const handleEnquiryInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // EmailJS handler
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryLoading(true);
    setEnquiryMessage('');

    try {
      // Prepare template parameters
      const templateParams = {
        from_name: enquiryForm.name,
        from_email: enquiryForm.email,
        phone: enquiryForm.phone,
        message: enquiryForm.message,
        item_name: selectedItem?.itemName || selectedItem?.name || '',
        item_type: selectedItem?.itemType || selectedItem?.type || '',
        item_description: selectedItem?.itemDescription || selectedItem?.description || '',
        item_id: selectedItem?.id || '',
        enquiry_date: new Date().toLocaleDateString(),
        enquiry_time: new Date().toLocaleTimeString()
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      if (response.status === 200) {
        setEnquiryMessage('Enquiry submitted successfully! We will get back to you soon.');
        setTimeout(() => {
          closeEnquiryModal();
        }, 3000);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setEnquiryMessage('Failed to send enquiry. Please try again or contact us directly.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  const nextImage = () => {
    if (selectedItem) {
      const totalImages = 1 + (selectedItem.additionalImageUrls?.length || 0);
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  };

  const prevImage = () => {
    if (selectedItem) {
      const totalImages = 1 + (selectedItem.additionalImageUrls?.length || 0);
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const getCurrentImage = () => {
    if (!selectedItem) return '';
    if (currentImageIndex === 0) {
      return selectedItem.coverImageUrl;
    }
    return selectedItem.additionalImageUrls?.[currentImageIndex - 1] || '';
  };

  const handleRefresh = () => {
    fetchItems();
    setError(null);
  };

  if (loading) {
    return (
      <div className="view-items-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-items-container">
      <header className="view-items-header">
        <div className="header-content">
          <div className="header-text">
            <h1>View Items</h1>
            <p>Browse all items in our collection</p>
          </div>
          <button className="add-item-btn" onClick={handleAddItemClick}>
            <span className="add-icon">+</span>
            Add Item
          </button>
        </div>
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={handleRefresh} className="refresh-btn">Refresh</button>
          </div>
        )}
      </header>

      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card" onClick={() => openModal(item)}>
            <div className="item-image-container">
              <img 
                src={item.coverImageUrl || item.coverImage} 
                alt={item.itemName || item.name} 
                className="item-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              <div className="item-overlay">
                <span className="view-details">View Details</span>
              </div>
              {!item.isStatic && (
                <div className="new-item-badge">New</div>
              )}
            </div>
            <div className="item-info">
              <h3 className="item-name">{item.itemName || item.name}</h3>
              <span className="item-type">{item.itemType || item.type}</span>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="empty-state">
          <h2>No items found</h2>
          <p>Add some items to see them here!</p>
          <button onClick={handleRefresh} className="refresh-btn">Refresh</button>
        </div>
      )}

      {/* Item Details Modal */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            
            <div className="modal-body">
              <div className="image-carousel">
                <button className="carousel-btn prev-btn" onClick={prevImage}>‹</button>
                <img 
                  src={getCurrentImage()} 
                  alt={selectedItem.itemName || selectedItem.name} 
                  className="modal-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x400?text=Image+Not+Found';
                  }}
                />
                <button className="carousel-btn next-btn" onClick={nextImage}>›</button>
                
                <div className="image-indicators">
                  {Array.from({ 
                    length: 1 + (selectedItem.additionalImageUrls?.length || 0) 
                  }).map((_, index) => (
                    <span 
                      key={index}
                      className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="item-details">
                <h2>{selectedItem.itemName || selectedItem.name}</h2>
                <span className="item-type-badge">{selectedItem.itemType || selectedItem.type}</span>
                <p className="item-description">
                  {selectedItem.itemDescription || selectedItem.description}
                </p>
                
                {selectedItem.createdAt && (
                  <p className="item-date">
                    Added: {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </p>
                )}
                
                <button className="enquire-button" onClick={openEnquiryModal}>
                  Enquire
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {showEnquiryModal && selectedItem && (
        <div className="modal-overlay" onClick={closeEnquiryModal}>
          <div className="modal-content enquiry-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeEnquiryModal}>×</button>
            
            <div className="enquiry-header">
              <h2>Send Enquiry</h2>
              <p>Enquiring about: <strong>{selectedItem.itemName || selectedItem.name}</strong></p>
            </div>

            {enquiryMessage && (
              <div className={`enquiry-message ${enquiryMessage.includes('successfully') ? 'success' : 'error'}`}>
                {enquiryMessage}
              </div>
            )}

            <form onSubmit={handleEnquirySubmit} className="enquiry-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={enquiryForm.name}
                  onChange={handleEnquiryInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={enquiryForm.email}
                  onChange={handleEnquiryInputChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={enquiryForm.phone}
                  onChange={handleEnquiryInputChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={enquiryForm.message}
                  onChange={handleEnquiryInputChange}
                  required
                  rows="4"
                  placeholder="Please provide details about your enquiry..."
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={closeEnquiryModal}
                  className="cancel-btn"
                  disabled={enquiryLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-enquiry-btn"
                  disabled={enquiryLoading}
                >
                  {enquiryLoading ? 'Sending...' : 'Send Enquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewItems;