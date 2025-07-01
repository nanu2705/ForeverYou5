import React, { useContext } from 'react'
import './Filter.scss'
import { Star } from '@mui/icons-material'
import MyContext from '../../Context/MyContext'
const Filter = () => {
  const{handleSortChange,handleSortPrice}=useContext(MyContext)
  return (
  
        <div className='main_filter'>
    
          <div className="filter_head">
        
          <span>Clear All</span>
          </div>
          <div className="filter_box">
            <div className="filter-head">
          <select className="select-filter" onChange={handleSortChange}>
         <option selected disabled>
          Filter
         </option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
        <option value="rating">By Rating</option>
         </select>
          <button>APPLY</button>
          </div>
               <div className="price-range" >
                  <span>PRICE RANGE</span> 
                 <span> <input type="checkbox" value="10" onClick={handleSortPrice}/><b>$10 - $100</b> </span>
                 <span> <input type="checkbox" value="100" onClick={handleSortPrice}/><b>$100 - $200</b> </span>
                 <span> <input type="checkbox" value="200" onClick={handleSortPrice}/><b>$200 - $300</b> </span>
                 <span> <input type="checkbox" value="300" onClick={handleSortPrice}/><b>Above $300</b> </span>
               </div>
  
               <div className="filter-size">
          
                  <span>SIZES</span>
                  <span> <input type="checkbox"/><b>S</b> </span>
                  <span> <input type="checkbox"/><b>M</b> </span>
                  <span> <input type="checkbox"/><b>L</b> </span>
               </div>
  
              <div className="filter-rating">
                  <span>RATINGS</span>
                  <span> <input type="checkbox"/><i>0<Star/> - 1<Star/></i></span>
                  <span> <input type="checkbox"/><i>2<Star/> - 3<Star/></i></span>
                  <span> <input type="checkbox"/><i>4<Star/> - 5<Star/></i></span>
              </div>
         
              <div className="filter-lifestyle">
              <span>LIFE STYLE</span>
                  <span> <input type="checkbox"/><i><b>Casual Wear</b></i></span>
                  <span> <input type="checkbox"/><i><b>Formal Wear</b></i></span>
                  <span> <input type="checkbox"/><i><b>Club Wear</b></i></span>
                  <span> <input type="checkbox"/><i><b>Sport Wear</b></i></span>
              </div>

              <div className="filter-deliveryday">
                <span>DELIVERY DAY</span>
                <span><input type='checkbox'/><b><i>Get in by Tomorrow</i></b></span>
                <span><input type='checkbox'/><b><i>Get it in 2 days</i></b></span>
              </div>
             
          </div>
      </div>
      )
     }
        
          

 

export default Filter