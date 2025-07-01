import React, { useContext } from 'react'
import './SingleProduct.scss'
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import MyContext from '../Context/MyContext';
import { useParams } from 'react-router-dom';
import { BiCopy } from 'react-icons/bi';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {  Pinterest, WhatsApp } from '@mui/icons-material';
import Tshirt from './Tshirt';


const SingleProduct = () => {

    const{product}=useParams()
    const{single}=useParams()

    const {isProductInCart,isProductInWish,handlewish,handletime,api,handleimg,issize,handleCart,showSize,size,setShow,handleMouseMove,show,cursorPosition,big,shareToWhatsApp,shareToPinterest} = useContext(MyContext)
  return (
  <>

  {
    api
    .filter(o=> o.route_category===product)
    .map((o)=>{
        return(

            <>
            {
                o.products
                .filter(i => i.route_productname===single)
                .map((i)=>{
                    return(
                          <div class="single-product">
                    <div class="image">
        
                   <div class="small-img">
              { i.side_image.map((si)=>{
                return(
                     <img src={si.in_image} alt="" onMouseEnter={() => handleimg(si.in_image)}/>
                )
              })
              } 
              </div>
            
        
              <div class="big-img">
                <img onMouseMove={handleMouseMove} 
                  src={i.productimg} alt="" id='imgpp'
                  onMouseEnter={handletime} 
                  onMouseLeave={() => setShow(false)}/>
              </div>
            </div>
         
        
            <div class="content">
                     
                      <div class="product-brand">{i.productbrand}</div>
                      <div className="product-title">{i.productname}</div>
                      
                      <div class="product-price">
                        <span>${i.productprice}</span>
                        <span>${i.productoldprice}</span> <br />
                      
                      </div>
                          <p>MRP Inclusive of all taxes</p>
            
                       
                      <span className='sizes'>Sizes:</span>
                        <div class="size">
                        { i.sizes_product.map((sizes)=>{
                return(
                     <span style={{backgroundColor:size===sizes.size && 'grey',
                      color:size===sizes.size && 'white' 
                     }} onClick={() =>showSize(sizes.size)}>{sizes.size}</span>
                )
              })
              }           
                        </div>

                      { issize && <error className="error">**please select size</error>}
            
                      {/* <div className="product-tomorrow">
                        { i.tomorrow ? <span>Get it by Tomorrow</span> : <span>Get it by 3-5 days</span>
                        }
                      </div> */}
                     <div className="product-description">
                      <h3>About this Product</h3>
                      {i.description && i.description.map((desc, index) => (
                       <p key={index}>{desc.text}</p>
                       ))}
                     </div>

                     <div className="product-returnpolicy">
                      NOTE: To be eligible for return or exchange, please ensure you record a clear unboxing video from the moment you open the package, as it will serve as proof in case of any issues.
                     </div>
            
                        <div class="btn">
                      {  !isProductInCart(o.id,i.id)?
                        
                          <button onClick={()=>handleCart(o.id,i.id,i.productimg,i.productname,i.productprice)}>Add to Cart</button>:
                          <button onClick={() => window.location.href='/cart'}>Go To Cart </button>
                      }

                      {  !isProductInWish(o.id,i.id)?
                          <button onClick={()=>handlewish(o.id,i.id,i.productimg,i.productname,i.productprice)}><span><FavoriteIcon/></span>Add to Wishlist</button>:
                          <button onClick={() => window.location.href='/wish'}>Go To Wish </button>
                      }
                        </div>
                      
                        <div className="share">
                    
<span onClick={shareToPinterest}><Pinterest/ ></span>
<span  onClick={() => shareToWhatsApp(window.location.href)}><WhatsApp/></span>
{/* <span onClick={() => shareToInstagram(window.location.href)}><Instagram/></span> */}

<CopyToClipboard text={window.location.href}>
                  <span><BiCopy/></span>
                  </CopyToClipboard>
</div>
           
                    </div>
                  </div>
                    )
                   
                    
                })
            }
             

            <Tshirt single={single}/>
            
            </>
            
        )
    })

  

  }


    {show && (
                      <div 
                      className='display' 
                      style={{ 
                      backgroundPosition: `-${cursorPosition.x * 2}px -${cursorPosition.y * 2}px`,
                      backgroundImage: `url(${big})`,
                      backgroundSize: '180%' 
                      }}
                      >
                      
                      </div>
                      )}
 </>
  )
}

export default SingleProduct