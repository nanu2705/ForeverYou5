import React, { useContext, useEffect } from 'react'
import "./Alert.scss"
import { CiHardDrive } from 'react-icons/ci'
import MyContext from '../../Context/MyContext'
import { GrAlert } from 'react-icons/gr'

const Alert = () => {

    const {message,openalert,setOpenalert} = useContext(MyContext)
    
const isThanks = message && message.match('Thanks')
    useEffect(() =>{
      if(openalert){
setTimeout(() => {
  setOpenalert(false)
}, 3000);
      }
    })
  return (
    <>
  {openalert &&  
    <div class="alert" style={{backgroundColor:!isThanks &&'red'}}>
 {isThanks? <CiHardDrive/>:<GrAlert/>}
    {message}
  
  </div>}
  </>
  )
}

export default Alert