import React, { useContext } from 'react';
import './Login.scss';
import { useFormik } from 'formik';
import * as yup from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { InputAdornment, TextField } from '@mui/material';
import MyContext from '../Context/MyContext';
import axios from 'axios';

const Login = () => {
  const { apiUrl,setLoadingin, loadingin, openregister, handleLogin, setMessage, setOpenalert } = useContext(MyContext);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
      password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoadingin(true);
      try {
        const { data } = await axios.post(
          `${apiUrl}/login`,
          values,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
    
        if (data.go === 'success') {
          handleLogin(data);
          resetForm();
        } else {
          setMessage(data.loginerror);
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
            <span>SIGN IN</span>
          </div>
          <form onSubmit={formik.handleSubmit} className='form'>
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
                    <EmailIcon />
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
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            {/*<h4>Forgot Password?</h4>*/}
            <button type="submit">
              {loadingin ? 'wait...' : 'Sign In'}
            </button>
          </form>
          <h3>Don't Have An Account?</h3>
          <br />
          <button type="button" onClick={openregister}>
            Sign Up
          </button>
          <br />
          <span>By clicking continue you agree to our <b>Terms of Service</b> and <b>Privacy Policy</b>.</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
