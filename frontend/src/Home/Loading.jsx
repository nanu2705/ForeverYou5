import React, { useContext } from 'react'
import "./Loading.scss"
import MyContext from '../Context/MyContext'


const Loading = () => {

    const {loadingin,apiloader} = useContext(MyContext)
  return (
<>
    {
(loadingin||apiloader) &&
    <div class="container-boxx">
    <div class="box">
        <div class="front-box"></div>
        <div class="back-box"></div>
        <div class="left-box"></div>
        <div class="right-box"></div>
        <div class="top-box"></div>
        <div class="bottom-box"></div>
    </div>
</div>

    }
    </>
  )
}

export default Loading