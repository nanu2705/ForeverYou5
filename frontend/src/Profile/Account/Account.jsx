import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Account.scss';
import axios from 'axios';
import MyContext from '../../Context/MyContext';
import LoginError from '../LoginError/LoginError';

const Account = () => {
  const { apiUrl,edit, setEdit,token, userdata, setUserdata, loadingin, setLoadingin, setOpenalert, setMessage } = useContext(MyContext);
  const [loader, setLoader] = useState(true);
 

  useEffect(() => {

  
    const fetchUserData = async () => {

      if (!token) {
        setLoader(false);
        return;
      }
      try {
        const { data } = await axios.get(`${apiUrl}/api/account-details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setUserdata(data.accountInfo);
        sessionStorage.setItem('userdata', JSON.stringify(data.accountInfo));
      } catch (error) {
        console.error('Failed to fetch account details:', error.response?.data?.error || error.message);
      } finally {
        setLoader(false);
      }
    };
  
    fetchUserData();
  }, [token, apiUrl, setUserdata]);
  

  if (loader) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {token ? (
        edit ? (
          <Formik
            initialValues={{
              name: userdata.name || '',
              email: userdata.email || '',
              mobile: userdata.mobile || '',
              password: '',
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required'),
              email: Yup.string().email('Invalid email address').required('Email is required'),
              mobile: Yup.string().required('Mobile number is required'),
              password: Yup.string().required('Password is required'),
            })}
            onSubmit={async (values) => {
              setLoadingin(true);
            
              try {
                const { data } = await axios.post(
                  `${apiUrl}/update-account-data`,
                  values,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
            
                if (data.success) {
                  setOpenalert(true);
                  setMessage(data.message);
                  setUserdata(data.accountInfo);
                  sessionStorage.setItem('userdata', JSON.stringify(data.accountInfo));
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                } else {
                  setOpenalert(true);
                  setMessage(data.error);
                }
              } catch (error) {
                console.error('Failed to update account data:', error.response?.data?.error || error.message);
                setOpenalert(true);
                setMessage('An error occurred. Please try again.');
              } finally {
                setLoadingin(false);
              }
            }}
            
          >
            {({ isSubmitting }) => (
              <Form className='name-main'>
                <h2>Update Account Details</h2>
                <div className='name-form'>
                  <div className='name-input'>
                    <label htmlFor="name">Name:</label>
                    <Field type="text" name="name" />
                    <ErrorMessage name="name" component="div" className="error-message" />
                  </div>
                  <div className='name-input'>
                    <label htmlFor="email">Email:</label>
                    <Field type="text" name="email" disabled/>
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>
                  <div className='name-input'>
                    <label htmlFor="mobile">Mobile:</label>
                    <Field type="text" name="mobile" />
                    <ErrorMessage name="mobile" component="div" className="error-message" />
                  </div>
                  <div className='name-input'>
                    <label htmlFor="password">Password:</label>
                    <Field type="password" name="password" placeholder='Enter Updated Password' />
                    <ErrorMessage name="password" component="div" className="error-message" />
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    {loadingin ? 'Wait...' : 'Submit'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className='account-details'>
            <h2>Account Information</h2>
            <p><strong>Name:</strong> {userdata && userdata.name}</p>
            <p><strong>Email:</strong> {userdata && userdata.email}</p>
            <p><strong>Mobile:</strong> {userdata && userdata.mobile}</p>
            <p><strong>Password:</strong> ********</p>
            <button onClick={() => setEdit(true)}>Edit</button>
          </div>
        )
      ) : (
        <LoginError title="Account information" />
      )}
    </>
  );
};

export default Account;
