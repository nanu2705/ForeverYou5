import React, { useContext } from 'react';
import './Login.scss'; // Using the same SCSS file
import { useFormik } from 'formik';
import * as yup from 'yup';
import { InputAdornment, TextField } from '@mui/material';
import { AccountCircle, EmailOutlined, Password, PhoneAndroid } from '@mui/icons-material';
import MyContext from '../Context/MyContext';
import axios from 'axios';

const Register = () => {
  const { apiUrl,openregister, setOpenalert, setLoadingin, setMessage } = useContext(MyContext);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
    },
    validationSchema: yup.object({
      name: yup
        .string('Enter your name')
        .required('Name is required'),
      email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
      mobile: yup
        .string()
        .matches(/^\d{10}$/, 'Invalid phone number')
        .required('Phone is required'),
      password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .max(12, 'Password should be of maximum 12 characters length')
        .required('Password is required')
        .matches(/^\S+$/, 'Password cannot contain whitespace'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoadingin(true);
      try {
        const { data } = await axios.post(
          `${apiUrl}/register`,
          values,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
    
        if (data.go === 'success') {
          setMessage(data.registermessage);
          setOpenalert(true);
          openregister();
          resetForm();
        } else {
          setMessage(data.registererror);
          setOpenalert(true);
        }
      } catch (error) {
        setMessage(error.response ? error.response.data.error : 'An error occurred');
        setOpenalert(true);
      } finally {
        setLoadingin(false);
      }
    },
    
  });

  return (
    <div className='login-main'>
      <div className="login-back">
        <div className="login-content">
          <div className="login-head">
            <span>Create an account</span>
          </div>
          <form onSubmit={formik.handleSubmit} className='form'>
            <TextField
              id="name"
              name="name"
              className='email'
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              placeholder='Enter Your Name'
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="email"
              name="email"
              className='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              placeholder='email@domain.com'
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined/>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="mobile"
              name="mobile"
              className='email'
              value={formik.values.mobile}
              onChange={formik.handleChange}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
              placeholder='Mobile'
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroid />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              type='password'
              id="password"
              name="password"
              className='email'
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              placeholder='Password'
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Password />
                  </InputAdornment>
                ),
              }}
            />
            <button type="submit">
              {formik.isSubmitting ? 'wait...' : 'Sign Up'}
            </button>
          </form>
          <h3>Already Have An Account?</h3>
          <br />
          <button type="button" onClick={openregister}>
            Sign In
          </button>
          <br />
          <span>By clicking continue you agree to our <b>Terms of Service</b> and <b>Privacy Policy</b>.</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
