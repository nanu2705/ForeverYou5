import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Home/Home'
import MyContextProvider from './Context/MyContextProvider'


const App = () => {
  return (
   
    <BrowserRouter basename="/admin"> 
    <MyContextProvider>

    <Routes>

      <Route path='/' element={<Home/>}/>
 

    </Routes>
    
    </MyContextProvider>
    </BrowserRouter>
  )
}

export default App
