import React, { useContext } from 'react'
import './Nopage.scss'
import img from '..//Images/error.png'
import MyContext from '../Context/MyContext';


const Nopage = () => {
  const{Navigate} = useContext(MyContext)
  return (
    <div className='page'>

        <div className="nopage">
            <span>Page Not Found</span>
            <button  onClick={() => Navigate(`/`) }>Go To Home</button>
        </div>

        <div className="image">
            <img src={img} alt=''/>
        </div>
    </div>
  )
}

export default Nopage