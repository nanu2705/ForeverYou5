import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import MyContext from '../Context/MyContext';
import './AdminSlider.scss';

const AdminSlider = () => {
  const { apiUrl } = useContext(MyContext);
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [productRoute, setProductRoute] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editRoute, setEditRoute] = useState('');

  const fetchImages = async () => {
    const res = await axios.get(`${apiUrl}/api/slider`);
    setImages(res.data.data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!newImage) return alert('Choose an image first!');
    const formData = new FormData();
    formData.append('imageUrl', newImage);
    formData.append('productRoute', productRoute);
    await axios.post(`${apiUrl}/api/slider`, formData);
    setNewImage(null);
    setProductRoute('');
    fetchImages();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image?')) {
      await axios.delete(`${apiUrl}/api/slider/${id}`);
      fetchImages();
    }
  };

  const startEdit = (img) => {
    setEditingId(img._id);
    setEditRoute(img.productRoute);
    setEditImage(null); // Keep old image by default
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRoute('');
    setEditImage(null);
  };

  const saveEdit = async () => {
    const formData = new FormData();
    if (editImage) formData.append('imageUrl', editImage);
    formData.append('productRoute', editRoute);
    await axios.put(`${apiUrl}/api/slider/${editingId}`, formData);
    cancelEdit();
    fetchImages();
  };

  return (
    <div className="admin-slider">
      <h2>Manage Slider Images</h2>

      <div className="upload-box">
        <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
        <input
          type="text"
          placeholder="Enter product route e.g. /product/123"
          value={productRoute}
          onChange={(e) => setProductRoute(e.target.value)}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <div className="slider-grid">
        {images.map((img) => (
          <div className="slide" key={img._id}>
            <img src={`${apiUrl}${img.imageUrl}`} alt="Slider" />
            {editingId === img._id ? (
              <>
                <input
                  type="text"
                  value={editRoute}
                  onChange={(e) => setEditRoute(e.target.value)}
                />
                <input type="file" onChange={(e) => setEditImage(e.target.files[0])} />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <p>{img.productRoute}</p>
                <button onClick={() => startEdit(img)}>Edit</button>
                <button onClick={() => handleDelete(img._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSlider;
