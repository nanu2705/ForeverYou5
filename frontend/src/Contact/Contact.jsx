import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Contact.scss';
import { Button } from '@mui/material';
import { CiMail } from "react-icons/ci";
import { IoPhonePortraitOutline } from "react-icons/io5";
import MyContext from '../Context/MyContext';
import axios from 'axios';
import {  HouseSidingOutlined } from '@mui/icons-material';

const Contact = () => {
  const { setOpenalert, apiUrl, setLoadingin, setMessage } = useContext(MyContext);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('**Name is required')
        .matches(/^([^0-9]*)$/, "**Don't allow Numeric Value"),
      email: Yup.string()
        .required('**Email is required')
        .email('**Enter a valid email'),
      mobile: Yup.string()
        .required('**Mobile number is required')
        .matches(/^[0-9]{10}$/, '**Mobile number is not valid'),
      message: Yup.string()
        .min(6, 'Min 6 characters required')
        .max(300, 'Too long!')
        .required('**Message is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoadingin(true);
      try {
        const { data } = await axios.post(`${apiUrl}/contact`, values, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (data.go === 'success') {
          setMessage(data.message);
        } else {
          setMessage(data.error || 'Something went wrong');
        }
        setOpenalert(true);
        resetForm();
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred');
        setOpenalert(true);
      } finally {
        setLoadingin(false);
      }
    },
  });

  return (
    <div className='Register_main'>
      <h2 className='reg_heading'>WE WOULD LOVE TO HEAR FROM YOU</h2>
      <div className="main">
       
        <form className='Register_form' onSubmit={formik.handleSubmit}>
           <h3>CONTACT US </h3>
          <label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </label>
          {formik.touched.name && formik.errors.name && (
            <div className="error">{formik.errors.name}</div>
          )}

          <label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}

          <label>
            <input
              type="text"
              placeholder="Mobile"
              name="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </label>
          {formik.touched.mobile && formik.errors.mobile && (
            <div className="error">{formik.errors.mobile}</div>
          )}

          <label>
            <textarea
              className="message"
              placeholder="Your Message for us"
              rows={3}
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </label>
          {formik.touched.message && formik.errors.message && (
            <div className="error">{formik.errors.message}</div>
          )}

          <Button className='reg_btn' type="submit" variant="contained">
            SUBMIT
          </Button>
        </form>

        <div className="info">
          <h3>INFORMATION</h3>
          <div className="contact_item">
            <CiMail />
            <span>
               <a href="mailto:for.everrnewcontact@gmail.com">
               for.everrnewcontact@gmail.com
               </a>
            </span>
          </div>
          <div className="contact_item">
            <IoPhonePortraitOutline />
            <span>
               <a href="tel:+91 9510434140">
               +91 9510434140
              </a>
            </span>
          </div>
          <div className="contact_item">
            <HouseSidingOutlined />
           <span>
    <a
      href="https://www.google.com/maps/search/?api=1&query=A-41+Balgopal+Society,+Near+Sai+Chokdi,+Manjalpur,+Vadodara+390011"
      target="_blank"
      rel="noopener noreferrer"
    >
      A-41 Balgopal Society, Near Sai Chokdi, Manjalpur, Vadodara 390011
    </a>
  </span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
