import React, { useState } from 'react';
import './AddItems.css';

const AddItems = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemType: '',
    itemDescription: '',
    coverImage: null,
    additionalImages: []
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [enquireLoading, setEnquireLoading] = useState(false);
  const [enquireData, setEnquireData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    enquiryMessage: ''
  });
  const [showEnquireForm, setShowEnquireForm] = useState(false);

  const itemTypes = ['Shirt', 'Pant', 'Shoes', 'Sports Gear', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnquireInputChange = (e) => {
    const { name, value } = e.target;
    setEnquireData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      coverImage: file
    }));
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      additionalImages: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('itemName', formData.itemName);
    formDataToSend.append('itemType', formData.itemType);
    formDataToSend.append('itemDescription', formData.itemDescription);
    
    if (formData.coverImage) {
      formDataToSend.append('coverImage', formData.coverImage);
    }
    
    formData.additionalImages.forEach((file, index) => {
      formDataToSend.append('additionalImages', file);
    });

    try {
      const response = await fetch('https://internshala-backend-j6l3.onrender.com/api/items', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setMessage('Item successfully added');
        setFormData({
          itemName: '',
          itemType: '',
          itemDescription: '',
          coverImage: null,
          additionalImages: []
        });
        // Reset file inputs
        document.getElementById('coverImage').value = '';
        document.getElementById('additionalImages').value = '';
      } else {
        setMessage('Error adding item');
      }
    } catch (error) {
      setMessage('Error adding item');
      console.error('Error:', error);
    }
    
    setLoading(false);
  };

  
  return (
    <div className="add-items-container">
      <div className="add-items-form">
        <h2>Add New Item</h2>
        
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              required
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="itemType">Item Type</label>
            <select
              id="itemType"
              name="itemType"
              value={formData.itemType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select item type</option>
              {itemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="itemDescription">Item Description</label>
            <textarea
              id="itemDescription"
              name="itemDescription"
              value={formData.itemDescription}
              onChange={handleInputChange}
              required
              placeholder="Enter item description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Item Cover Image</label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleCoverImageChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalImages">Item Additional Images</label>
            <input
              type="file"
              id="additionalImages"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesChange}
            />
            <small>You can select multiple images</small>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding Item...' : 'Add Item'}
            </button>
            
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddItems;