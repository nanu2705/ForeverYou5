import React, { useContext } from 'react'
import "./Loading.scss"
import MyContext from '../Context/MyContext'


const Loading = () => {

    const {loadingin,apiloader} = useContext(MyContext)
  return (
<>
    {
(loadingin||apiloader) &&
    <div className="canva-loader">
      <h1>Forever You...</h1>
    </div>

    }
    </>
  )
}

export default Loading