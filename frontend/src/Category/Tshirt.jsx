import React, { useContext } from 'react';
import './Tshirt.scss';
import { useParams } from 'react-router-dom';
import MyContext from '../Context/MyContext';
import { Favorite, Star } from '@mui/icons-material';

const Tshirt = ({ single }) => {
  const { product } = useParams();
  const { api, isProductInWish, handlewish, removeProductFromWish, isProductInCart, loadingin, issize, showSize, size, handleCart, setSize ,Navigate} = useContext(MyContext);

  const newdata = product ? api.filter(item => item.route_category === product) : api;

  return (
    <>
      {product && !single && <h1 className='category-head'>{product}</h1>}
      {single && <h1 className='category-head'>Related Products</h1>}


      <div className='card-main'>

     
        {newdata.map((o) => (
          <>
            {o.products.filter(i => i.route_productname !== single).map((i) => (
              <div className='card' key={i.id} onMouseLeave={() => setSize('')}>
                <div className="productdetails">
                  <div className="productimage" >
                    <img src={i.productimg} alt={i.productname} onClick={() => Navigate(`/category/${o.route_category}/${i.route_productname}`)}/>
                    {!isProductInWish(o.id, i.id) ? (
                      <span onClick={() => handlewish(o.id, i.id, i.productimg, i.productname, i.productprice, i.productbrand)}>
  <Favorite />
</span>
                    ) : (
                      <span onClick={() => removeProductFromWish(o.id, i.id)}>
                        <Favorite style={{ color: 'pink' }} />
                      </span>
                    )}
                  </div>
                  <div className="productcontent">
                    <div className="productbrand">{i.productbrand}</div>
                    {/* <div className="productbrand">{i.productname}</div> */}
                    <div className="productbrand">₹{i.productprice}</div>
                  </div>
                  <div className="producttop">
                    <div className="sizes">
                      <span>{i.review}<Star /></span>
                      {!isProductInCart(o.id, i.id) ? (
                        <button onClick={() => handleCart(o.id, i.id, i.productimg, i.productname, i.productprice)}>
                          {loadingin ? 'ADDING...' : 'Add to Cart'}
                        </button>
                      ) : (
                        <button onClick={() => window.location.href = '/cart'}>Go To Cart</button>
                      )}
                      <div className="flexs">
                        {i.sizes_product.map((s) => (
                          <span
                            key={s.size}
                            style={{ backgroundColor: size === s.size ? 'pink' : 'transparent', color: size === s.size ? 'white' : 'black' }}
                            onClick={() => showSize(s.size)}
                          >
                            {s.size}
                          </span>
                        ))}
                        {issize && <p>**Select size</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ))}
      </div>
    </>
  );
};

export default Tshirt;
