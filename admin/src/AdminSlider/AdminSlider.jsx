import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import MyContext from '../Context/MyContext';
import './AdminSlider.scss';

const AdminSlider = () => {
  const { apiUrl } = useContext(MyContext);
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);

  const fetchImages = async () => {
    const res = await axios.get(`${apiUrl}/api/slider`);
    setImages(res.data.data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!newImage) return alert("Choose an image first!");
    const formData = new FormData();
    formData.append("imageUrl", newImage);
    await axios.post(`${apiUrl}/api/slider`, formData);
    setNewImage(null);
    fetchImages();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this image?")) {
      await axios.delete(`${apiUrl}/api/slider/${id}`);
      fetchImages();
    }
  };

  return (
    <div className="admin-slider">
      <h2>Manage Slider Images</h2>
      <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      <div className="slider-grid">
        {images.map((img) => (
          <div className="slide" key={img._id}>
            <img src={`${apiUrl}${img.imageUrl}`} alt="Slider" />
            <button onClick={() => handleDelete(img._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSlider;
