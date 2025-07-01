import React, { useContext } from 'react'
import './LoginError.scss'
import MyContext from '../../Context/MyContext'

const LoginError = ({title}) => {
    const{handleLoginOpen} = useContext(MyContext)
  return (
    <div className='loginerror'>
    To View {title} Please Login First
    <span onClick={handleLoginOpen}>click here to Login</span>
    </div>
  )
}

export default LoginError