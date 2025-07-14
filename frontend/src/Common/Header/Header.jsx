  import React, { useContext, useState } from 'react' 
  import './Header.scss' 
  import FavoriteIcon from '@mui/icons-material/Favorite'; 
  import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
  import PersonIcon from '@mui/icons-material/Person'; 
  import SearchIcon from '@mui/icons-material/Search';  
  import CloseIcon from '@mui/icons-material/Close';
  import MyContext from '../../Context/MyContext';
  import Modal from '../../Modal/Modal';
import { LocalShipping, LogoutOutlined, TurnSlightRight, VerifiedUser } from '@mui/icons-material';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from "../../Assets/newlogo.png"




  

  const Header = () => { 

  

  
  
    const {wish,cart,token,userdata,api,details,opensearch,setOpensearch,setDetails,handleLoginOpen,handleLogout,Navigate,input,setInput,openmodal} = useContext(MyContext)
  
const [menuOpen, setMenuOpen] = useState(false);
   
   
  
  return ( 
    <>
    <div className='head'>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`left ${menuOpen ? 'open' : ''}`}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      
    <span className='wishes' onClick={() => window.location.href='/wish'}>Wishlist</span> 
       
    <span className="scart" onClick={() => window.location.href='/cart'}> Cart</span>
       </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
      

      <div className="middle"  onClick={() =>Navigate('/')}>
        <img src={logo} alt="" />
      </div>
 

      <div className="right">  

      {  opensearch &&
        <div className='search-anim'>
          <div className='search-bar'><span><SearchIcon/></span> <input type="text" placeholder='What are you looking for ?' value={input} onChange={(e) => setInput(e.target.value)} />
          <div class="search-list">
   {input &&
    api.flatMap((b) => {
      const inputLower = input.toLowerCase();
      const matches = [];

      if (b.category.toLowerCase().includes(inputLower)) {
        matches.push(
          <li key={b.route_category} onClick={() => {
            Navigate(`/category/${b.route_category}`);
            setInput('');
            setOpensearch(false);
          }}>
             {b.category}
          </li>
        );
      }

      b.products?.forEach((product) => {
        if (
          product.productname.toLowerCase().includes(inputLower) ||
          product.productbrand.toLowerCase().includes(inputLower)
        ) {
          matches.push(
            <li key={product.route_productbrand} onClick={() => {
              Navigate(`/product/${product.route_productname}`);
              setInput('');
              setOpensearch(false);
            }}>
               {product.productbrand}
            </li>
          );
        }
      });

      return matches;
    })}


</div>
          </div>

      </div>}

      {!opensearch?
      <span  onClick={() => setOpensearch(true) }  className='small-search'><SearchIcon/></span> :
      <span  onClick={() => setOpensearch(false) || setInput('') } ><CloseIcon/></span>
      }

      <span className='wishes'
      onClick={() => window.location.href='/wish'}><FavoriteIcon style={{ color: wish && wish.length>0 && 'pink' }}/></span> 
       
     <span className="scart" 
     onClick={() => window.location.href='/cart'}> <ShoppingCartIcon/><b>{cart?.length || 0}</b></span>
        
       
      {!token ? <span onClick={handleLoginOpen} ><PersonIcon/></span>:
        <div className='nameo' onClick={() =>  setDetails(!details)} ><strong>{userdata && userdata.name}</strong>Account</div>}
      

      {details &&
       <div class="account-show" >
    
        <li onClick={() => window.location.href='/account-details'}>
          <span><VerifiedUser/></span>
          <span class="text">Account-Details</span>
          </li>

          <li onClick={()=>window.location.href='/shipping-details'}>
          <span><LocalShipping/></span>
          <span class="text">Shipping-Details</span>
        </li>

        <li onClick={handleLogout}>
          <span><LogoutOutlined/></span>
          <span class="text" >Logout</span>
        </li>
      
       </div>}      
      </div>

    </div>
  
    <div className='search-mobile'><span><SearchIcon/></span> <input type="text" placeholder='Search on Forever You...' value={input} onChange={(e) => setInput(e.target.value)} />
   
    <div class="searchlistmobile">
    {input &&
    api.flatMap((b) => {
      const inputLower = input.toLowerCase();
      const matches = [];

      if (b.category.toLowerCase().includes(inputLower)) {
        matches.push(
          <li key={b.route_category} onClick={() => {
            Navigate(`/category/${b.route_category}`);
            setInput('');
            setOpensearch(false);
          }}>
             {b.category}
          </li>
        );
      }

      b.products?.forEach((product) => {
        if (
          product.productname.toLowerCase().includes(inputLower) ||
          product.productbrand.toLowerCase().includes(inputLower)
        ) {
          matches.push(
            <li key={product.route_productbrand} onClick={() => {
              Navigate(`/product/${product.route_productname}`);
              setInput('');
              setOpensearch(false);
            }}>
               {product.productname}
            </li>
          );
        }
      });

      return matches;
    })}

</div>
    </div>



    {openmodal && <Modal/>}

    </>
    )
  }

  export default Header