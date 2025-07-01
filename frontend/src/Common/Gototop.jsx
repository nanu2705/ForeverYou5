// GoToTop.jsx
import { useContext, useEffect } from "react";
import MyContext from "../Context/MyContext";

const GoToTop = () => {
const{location} = useContext(MyContext)

useEffect(() => {
    window.scrollTo(0, 0);
}, [location]);
return null;
}
          
export default GoToTop