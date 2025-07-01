import React, { useEffect, useState } from 'react'
import MyContext from './MyContext'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


const MyContextProvider = ({children}) => {

  const apiUrl = 'http://localhost:3034' ;
       //for api calling start

 const[apiloader,setApiloader]=useState(true)
const[api,setApi] = useState([])

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/data`);
      setApi(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setApiloader(false);
    }
  };

  fetchData();
}, [apiUrl]);
// for api calling end



    // location common
  const location = useLocation()  
  // for location end

  // for navigation start
  const Navigate = useNavigate()
  // for navigation end

// for serch open search bar start
const[opensearch,setOpensearch] =useState(false)
// for serch open search bar end

// for save input value-search start
const[input,setInput]=useState("") 
// for save input value-search end

// for login open state start
const [openmodal, setOpenmodal] = useState(false);
// for login open state end


// for show login first and hide regiter start
const[showSignin,setShowSignin] =useState(false)
// for show login first and hide regiter end




// for open modal login start
const handleLoginOpen = () =>{
  setOpenmodal(true)
  document.querySelector('body').style.overflow="hidden"
}
// for open modal login end


  // for close modal login start
const handleLoginClose = () =>{
  setOpenmodal(false)
  setShowSignin(false)
  document.querySelector('body').style.overflow="auto"
}
 // for close modal login end


//  for open register start
 const openregister =()=>{
  setShowSignin(!showSignin)
  }
  //  for open register end

// for open account modal start
const [details,setDetails] =useState(false)
// for open account modal end



// for token save state start
const [token,setToken] = useState(()=>{
  const storedToken = sessionStorage.getItem('token');
  return storedToken? storedToken:''
}) 


// for token save state end


// for user login start
const handleLogin = (data) =>{

setMessage(data.loginmessage)
setToken(data.data)
sessionStorage.setItem('token',data.data)
sessionStorage.setItem('userdata', JSON.stringify(data.accountInfo));
sessionStorage.setItem('cart', JSON.stringify(data.cartInfo));
sessionStorage.setItem('wish', JSON.stringify(data.wishInfo));
sessionStorage.setItem('shipping', JSON.stringify(data.shippingInfo));
sessionStorage.setItem('order', JSON.stringify(data.orderInfo));
setUserdata(data.accountInfo)
setShipping(data.shippingInfo)
setCart(data.cartInfo)
setWish(data.wishInfo)
setOrder(data.orderInfo)
setOpenalert(true)
handleLoginClose()

}
// for user login end

 let warningTimer = null;
  let logoutTimer = null;

// for user logout start
const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      clearSession();
      window.location.reload();
    }
  };

  const autoLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const clearSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userdata');
    sessionStorage.removeItem('cart');
    sessionStorage.removeItem('wish');
    sessionStorage.removeItem('shipping');
    sessionStorage.removeItem('order');
    setToken('');
    setUserdata(null);
    setCart([]);
    setWish([]);
    setShipping(null);
    setOrder([]);
    setDetails(false);
  };

  const resetTimers = () => {
    if (warningTimer) clearTimeout(warningTimer);
    if (logoutTimer) clearTimeout(logoutTimer);

    if (token) {
      warningTimer = setTimeout(() => setOpenmodal(true), 9 * 60 * 1000); // 9 mins
      logoutTimer = setTimeout(() => autoLogout(), 10 * 60 * 1000); // 10 mins
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetTimers);
    window.addEventListener('keydown', resetTimers);

    resetTimers();

    return () => {
      window.removeEventListener('mousemove', resetTimers);
      window.removeEventListener('keydown', resetTimers);
    };
  }, [token]);

  // for user logout end

// for form submiting loader open state start
  const[loadingin,setLoadingin] =useState(false)
  // for form submiting loader open state end

// for saving message from backend state start
  const [message,setMessage] = useState('')
  // for saving message from backend state end

// show sneckbar for success and alert state start
  const [openalert,setOpenalert] = useState(false)
  // show sneckbar for success and alert state end


  // for sorting product state start
  const [sortOrder, setSortOrder] = useState("");

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };
    // for sorting product state end
 
// for show size error start
    const[issize,setIssize]=useState(false)
    // for show size error end


    // for store size state start 
    const [size,setSize] = useState('')
    // for store size state end
  

    // for clicking on size button start
    const showSize = (s) =>{
      setSize(s)
      setIssize(false)
    }
// for clicking on size button end



// for account data save state start
const [userdata, setUserdata] = useState(() => {
  const storedUserData = sessionStorage.getItem('userdata');
  return storedUserData? JSON.parse(storedUserData):null
});

// for account data save state end



// for edit users information state start
const [edit, setEdit] = useState(false);
// for edit users information state end






// for save cart data state start
const [cart, setCart] = useState(() => {
  const savedCart = sessionStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
});



const clearCart = () => {
  setCart([]); // or however you're managing cart state
  localStorage.removeItem("cart"); // if you're storing cart in localStorage too
};
// for save cart data state end





// FOR ADD TO CART PROCESS START
const handleCart = async (categoryid, productid, productimg, productname, productprice) => {
  if (!token) {
    setMessage('Please login first');
    setOpenalert(true);
    setTimeout(() => {
      handleLoginOpen();
    }, 3000);
    return;
  }

  if (!size) {
    setIssize(true);
    return;
  }

  setLoadingin(true);

  try {
    const { data } = await axios.post(
      `${apiUrl}/add-to-cart`,
      { categoryid, productid, productimg, productname, productprice, size },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      setMessage(data.message);
      sessionStorage.setItem('cart', JSON.stringify(data.cartInfo));
      setCart(data.cartInfo);
      setOpenalert(true);
      setSize('');
    } else {
      setMessage(data.error);
      setOpenalert(true);
      setSize('');
    }
  } catch (error) {
    console.error('Error adding to cart:', error.response ? error.response.data.error : error.message);
    setMessage('An error occurred. Please try again.');
    setOpenalert(true);
  } finally {
    setLoadingin(false);
  }
};


 // FOR ADD TO CART PROCESS end


 // remove product from cart start

 const removeProductFromCart = async (categoryid, productid, size) => {
  try {
    setLoadingin(true);
    const { data } = await axios.post(`${apiUrl}/remove-from-cart`, 
      { categoryid, productid, size },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (data.success) {
      setMessage(data.message);
      sessionStorage.setItem('cart', JSON.stringify(data.cartInfo));
      setCart(data.cartInfo);
      setOpenalert(true);
    } else {
      setMessage(data.error);
      setOpenalert(true);
    }
  } catch (error) {
    console.error('Error removing from cart:', error.response ? error.response.data.error : error.message);
  } finally {
    setLoadingin(false);
  }
};

// remove product from cart end


// for increase quantity in cart start
const handleIncreaseQuantity = async (categoryid, productid, size) => {
  try {
    setLoadingin(true);

    const { data } = await axios.post(`${apiUrl}/increase-quantity`, 
      { categoryid, productid, size },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (data.success) {
      setMessage(data.message);
      sessionStorage.setItem('cart', JSON.stringify(data.cartInfo));
      setCart(data.cartInfo);
      setOpenalert(true);
    } else {
      setMessage(data.error);
      setOpenalert(true);
    }
  } catch (error) {
    console.error('Error increasing quantity:', error.response ? error.response.data.error : error.message);
  } finally {
    setLoadingin(false);
  }
};


// for increase quantity in cart end


// for decrease quantity in cart start
const handleDecreaseQuantity = async (categoryid, productid, size) => {
  try {
    setLoadingin(true);

    const { data } = await axios.post(`${apiUrl}/decrease-quantity`, 
      { categoryid, productid, size },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (data.success) {
      setMessage(data.message);
      sessionStorage.setItem('cart', JSON.stringify(data.cartInfo));
      setCart(data.cartInfo);
      setOpenalert(true);
    } else {
      setMessage(data.error);
      setOpenalert(true);
    }
  } catch (error) {
    console.error('Error decreasing quantity:', error.response ? error.response.data.error : error.message);
  } finally {
    setLoadingin(false);
  }
};


// for decrease quantity in cart end


 // total value start
const TotalValue =cart && cart.reduce((acc, item) => acc + (item.productprice * item.quantity), 0);
// total value end


 // show go to cart start
const isProductInCart = (categoryid,productid) => {
  if (cart) {
      return cart.find(item =>item.categoryid===categoryid && item.productid === productid && item.size===size);
  }
  return false;
};

// show go to cart end

// for wish list  start
const [wish, setWish] = useState(() => {
  const savedwish = sessionStorage.getItem('wish');
  return savedwish ? JSON.parse(savedwish) : [];
});
// for wish list  end


// FOR ADD TO Wish PROCESS START
const handlewish = async (categoryid, productid, productimg, productname, productprice) => {
  if (!token) {
    setMessage('Please login first');
    setOpenalert(true);
    setTimeout(() => {
      handleLoginOpen();
    }, 3000);
    return;
  }

  setLoadingin(true);
  
  try {
    const { data } = await axios.post(`${apiUrl}/add-to-wish`, 
      { categoryid, productid, productimg, productname, productprice },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (data.success) {
      setMessage(data.message);
      sessionStorage.setItem('wish', JSON.stringify(data.wishInfo));
      setWish(data.wishInfo);
      setOpenalert(true);
    } else {
      setMessage(data.error);
      setOpenalert(true);
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error.response ? error.response.data.error : error.message);
  } finally {
    setLoadingin(false);
  }
};


 // FOR ADD TO Wish PROCESS end



  // remove product from cart start

  const removeProductFromWish = async (categoryid, productid) => {
    try {
      setLoadingin(true);
  
      const { data } = await axios.post(
        `${apiUrl}/remove-from-wish`,
        { categoryid, productid },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (data.success) {
        setMessage(data.message);
        sessionStorage.setItem('wish', JSON.stringify(data.wishInfo));
        setWish(data.wishInfo);
        setOpenalert(true);
      } else {
        setMessage(data.error);
        setOpenalert(true);
      }
    } catch (error) {
      console.error('Error removing from wish:', error.response ? error.response.data.error : error.message);
    } finally {
      setLoadingin(false);
    }
  };
  
// remove product from cart end


 // show go to wish start
 const isProductInWish = (categoryid,productid) => {
  if (wish) {
      return wish.find(item =>item.categoryid===categoryid && item.productid === productid );
  }
  return false;
};

// show go to wish end

// for shipping data save state start
const [shipping, setShipping] = useState(()=>{
  const storedShipping = sessionStorage.getItem('shipping');
  return storedShipping? JSON.parse(storedShipping):null
})


// for shipping data save state end

// for single image  position state start
 const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
 // for single image  position state end


//  for single big image show hidden state start
 const [show, setShow] = useState(false);
 //  for single big image show hidden state end
 

//  for single mouse move start
 const handleMouseMove = (event) => {
 const image = document.getElementById('imgpp');
 const rect = image.getBoundingClientRect();
 const x = event.clientX - rect.left - 25; 
 const y = event.clientY - rect.top - 25; 
 
 setCursorPosition({ x, y });
 };
 //  for single mouse move end

 
//  for save src of single image hover start
 const[big,setBig] =useState('')
 //  for save src of single image hover end


// for show big hover image start
 const handletime = () =>{
    setShow(true)
setBig(document.getElementById('imgpp').src)
}
// for show big hover image end


// for multiple side image hover start
      const handleimg = (img) =>{
document.getElementById('imgpp').src=img
      }
      // for multiple side image hover end



     //for social sharing link start
 // WhatsApp
const shareToWhatsApp = () => {
  const productLink = window.location.href;
  const message = `Hey, check out this on Forever You I found! 💃👇\n${productLink}`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

// Pinterest
const shareToPinterest = () => {
  const url = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}`;
  window.open(url, "_blank");
};

// Twitter (Now called X)
const shareToTwitter = () => {
  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`;
  window.open(url, "_blank");
};

// Instagram – info only
// const shareToInstagram = () => {
//   alert("Instagram does not support direct URL sharing. You can manually share this link on your profile or story.");
//   // Optional: copy the URL to clipboard
//   navigator.clipboard.writeText(window.location.href);
// };


    //for social sharing link end



    
// for order list  start
const [order, setOrder] = useState(() => {
  const savedorder = sessionStorage.getItem('order');
  return savedorder ? JSON.parse(savedorder) : [];
});
// for order list  end



// for payment option start

// const handlepay = async () => {
//   try {
//     const { data } = await axios.post(
//       `${apiUrl}/add-to-order`,
//       { orderDate: new Date() },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         }
//       }
//     );

//     if (data.success) {
//       setMessage(data.message);
//       sessionStorage.setItem('cart', JSON.stringify(data.cartInfo));
//       sessionStorage.setItem('order', JSON.stringify(data.orderInfo));
//       setCart(data.cartInfo);
//       setOrder(data.orderInfo);
//       setOpenalert(true);
//     } else {
//       setMessage(data.error);
//       setOpenalert(true);
//     }
//   } catch (error) {
//     console.error('Error during order submission:', error.response?.data?.error || error.message);
//   } finally {
//     setLoadingin(false);
//   }
// };

    
//     const handleupi = async (e) => {
//       setLoadingin(true);
    
//       try {
//         // Use axios to make the POST request
//         const {data} = await axios.post(`${apiUrl}/razorpay`, {
//           amount: TotalValue
//         }, {
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         });
    
      
    
//         if (data.success !== true) {
//           setOpenalert(true);
//           setMessage(data.error);
//         } else {
//           const options = {
//             key: process.env.REACT_APP_RAZORPAY_KEY,
//             amount: data.amount,
//             currency: data.currency,
//             image: "https://i.ibb.co/wdj924Q/image-2024-08-18-074932280.png",
//             name: "ZEPHYR",
//             description: "Test Transaction",
//             order_id: data.id,
//             config: {
//               display: {
//                 blocks: {
//                   utib: { 
//                     name: "most recommended using",
//                     instruments: [
//                       {
//                         method: "card",
//                         types: ["debit", "credit"]
//                       },
//                       {
//                         method: "upi",
                        
//                       }
//                     ]
//                   },
                
//                 },
//                 hide: [
//                   {
//                     method: "upi",
//                     flows: ["qr"]
//                   },

//                   {
//                     method: "wallet",
                  
//                   },

//                   {
//                     method: "paylater",
                  
//                   }
//                 ],
//                 sequence: ["block.utib", "block.other"],
//                 preferences: {
//                   show_default_blocks: true
//                 }
//               }
//             },
//             handler:async (response) => {
//               await handlepay(); 
//             Navigate('/confirm');
//             },
//             // modal: {
//             //   ondismiss: function () {
//             //     if (window.confirm("Are you sure you want to close the form?")) {
//             //       console.log("Checkout form closed by the user");
//             //     } else {
//             //       console.log("Complete the Payment");
//             //     }
//             //   }
//             // },
//             theme: {
//               color: "#F4ACBD",
//               hide_topbar: false,
//               shape: "rectangular",
//               header: {
//                 color: "#fff",
//                 text: "Payment"
//               }
//             }
//           };
    
//           const rzp1 = new window.Razorpay(options);
//           rzp1.open();
//         }
//       } catch (error) {
//         alert(error.message);
//         console.error("Error during payment process:", error);
//       } finally {
//         setLoadingin(false);
//       }
//     };
    


  return (
    <div>

    <MyContext.Provider value={{order,apiloader,apiUrl,setOrder,handlewish,TotalValue,shipping,setShipping,
    removeProductFromWish,isProductInWish,isProductInCart,wish,setWish,handleIncreaseQuantity,handleDecreaseQuantity,removeProductFromCart,
    edit, setEdit,userdata,setUserdata,cart,handleLogin, setCart,location,handletime,shareToWhatsApp,shareToPinterest,shareToTwitter,big,setBig,handleMouseMove,show, setShow,cursorPosition, setCursorPosition,size,showSize,setSize,handleCart,issize,setIssize,handleSortChange,sortOrder,setSortOrder,handleimg,api,token,opensearch,setOpensearch,setToken,openalert,setOpenalert,Navigate,openregister ,handleLoginClose,openmodal,setOpenmodal,handleLoginOpen,showSignin,setShowSignin,
            message,setMessage,handleLogout,
             input,setInput,loadingin,setLoadingin
            ,details,setDetails,  clearCart
            }}>
{children}
        </MyContext.Provider>
    </div>
  )
}

export default MyContextProvider