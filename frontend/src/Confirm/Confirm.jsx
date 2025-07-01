import React, { useContext } from 'react'
import './Confirm.scss'
import MyContext from '../Context/MyContext'
import LoginError from '../Profile/LoginError/LoginError'
import { FaCheckCircle } from 'react-icons/fa';

const Confirm = () => {
    const {token} = useContext(MyContext)
  return (
<>
    {token ?
        <div className="confirmation-container">
        <div className="confirmation-box">
          <div className="confirmation-icon">
            <FaCheckCircle />
          </div>
          <div className="confirmation-message">
            Your Order Has Been Placed
          </div>

          <div className='order-btn' onClick={() => window.location.href ='/order'}>Order Details</div>
        </div>
      </div>:

    <LoginError title="confirm information" />

    }

    </>
  )
}

export default Confirm