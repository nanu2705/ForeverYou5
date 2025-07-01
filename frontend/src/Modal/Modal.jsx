import React, { useContext } from 'react';
import './Modal.scss';
import MyContext from '../Context/MyContext';
import Login from '../Profile/Login';
import Register from '../Profile/Register';

const Modal = () => {
  const { handleLoginClose, showSignin } = useContext(MyContext);

  return (
    <>
      <div className='overlayp'></div>
      <div className='modalo'>
        
          <span className='close' onClick={handleLoginClose}>&times;</span>
          {!showSignin ? <Login /> : <Register />}
       
      </div>
    </>
  );
}

export default Modal;
