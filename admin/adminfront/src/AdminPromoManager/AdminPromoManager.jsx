import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPromoManager.scss';
import MyContext from '../Context/MyContext';

const AdminPromoManager = () => {
  const { apiUrl, banners, setBanners } = useContext(MyContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: null, // store uploaded file here
    ctaText: '',
    ctaLink: '',
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/promos`);
      setBanners(res.data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  },);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl') {
      setFormData({ ...formData, imageUrl: files[0] }); // file object
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('ctaText', formData.ctaText);
    data.append('ctaLink', formData.ctaLink);
    data.append('imageUrl', formData.imageUrl); // use same field name
    

    try {
      if (editId) {
        await axios.put(`${apiUrl}/api/promos/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${apiUrl}/api/promos`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setFormData({
        title: '',
        description: '',
        imageUrl: null,
        ctaText: '',
        ctaLink: '',
      });
      setEditId(null);
      fetchBanners();

      alert('Banner saved successfully!');
      console.log('Banner saved successfully',formData.imageUrl);
    } catch (error) {
      console.error('Error saving banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: null, // we don't load existing image into file input
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
    });
    setEditId(banner._id);
  };

  const handleCancelEdit = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: null,
      ctaText: '',
      ctaLink: '',
    });
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      try {
        await axios.delete(`${apiUrl}/api/promos/${id}`);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  return (
    <div className="admin-banner-manager">
      <h2>Promo Banner Manager</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Banner Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Banner Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="imageUrl"
          accept="image/*"
          onChange={handleChange}
          required={!editId}
        />
        <input
          type="text"
          name="ctaText"
          placeholder="CTA Text"
          value={formData.ctaText}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ctaLink"
          placeholder="CTA Link"
          value={formData.ctaLink}
          onChange={handleChange}
          required
        />

        <div style={{ marginTop: '10px' }}>
          <button type="submit" disabled={loading}>
            {editId ? 'Update Banner' : 'Add Banner'}
          </button>
          {editId && (
            <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="banner-list">
        <h3>Existing Banners</h3>
        {banners.length === 0 ? (
          <p>No banners found.</p>
        ) : (
          banners.map((banner) => (
            <div key={banner._id} className="banner-item">
              <img src={banner.imageUrl} alt={banner.title} />
              <div className="details">
                <h4>{banner.title}</h4>
                <p>{banner.description}</p>
                <small>
                  {banner.ctaText} →{' '}
                  <a href={banner.ctaLink} target="_blank" rel="noopener noreferrer">
                    {banner.ctaLink}
                  </a>
                </small>
              </div>
              <div className="actions">
                <button onClick={() => handleEdit(banner)}>Edit</button>
                <button onClick={() => handleDelete(banner._id)} className="danger">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPromoManager;
