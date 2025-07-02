import React, { useContext} from 'react';
import './Footer.scss';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MyContext from '../Context/MyContext';
import axios from 'axios';

const Footer = () => {
  const { setLoadingin, setMessage, setOpenalert, apiUrl } = useContext(MyContext);


  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: yup.object({
      email: yup.string().email('Enter a valid email').required('Email is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoadingin(true);
      try {
        const { data } = await axios.post(`${apiUrl}/newlater`, values, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (data.success) {
          setOpenalert(true);
          setMessage(data.message);
          resetForm();
        } else {
          setOpenalert(true);
          setMessage(data.error);
        }
      } catch (error) {
        alert(error.response ? error.response.data.error : error.message);
      } finally {
        setLoadingin(false);
      }
    },
  });

  return (
    <div className="footer-title">
      <div className="main-upper">
        <div className="first">
          <h3>About ForeverYou</h3>
          <p>
            Born from fresh perspectives and refined ambition, ForeverYou is a new voice in the world of fashion.
            Designed for those who appreciate understated elegance and modern sophistication, our brand celebrates
            quality and originality. As we begin this journey, we thank you for embracing a new standard of style.
          </p>
        </div>

        <div className="second">
          <div className="footer-section-header">
            <h3>Quick Links</h3>          
          </div>
            <div className="footer-links">
              <a href="/">Home</a>
              <a href="/about">About Us</a>
              <a href="/contact">Contact Us</a>
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-and-conditions">Terms of Service</a>
            </div>
        </div>

        <div className="third">
          <div className="footer-section-header">
            <h3>Support</h3>
          </div>
            <div className="footer-links">
              <a href="/return-refund-policy">Return Policy</a>
              <a href="/shipping-policy">Shipping Info</a>
            </div>
        </div>

        <div className="news">
          <h3>Newsletter</h3>
          <form onSubmit={formik.handleSubmit} className="form">
            <TextField
              id="email"
              name="email"
              placeholder="Enter your Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              variant="standard"
            />
            <Button variant="contained" type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="main-lower">
        <h4>Follow Us On</h4>
        <div className="social-icons">
          <a href="https://www.facebook.com/your_page" target="_blank" rel="noopener noreferrer">
            <FacebookIcon />
          </a>
          <a href="https://www.instagram.com/foreveryou.55" target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
          </a>
        </div>
        <p>&copy; 2025 All rights reserved by ForeverYou</p>
      </div>
    </div>
  );
};

export default Footer;
