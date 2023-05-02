import { useState } from 'react'
import './App.css'
import NavBar from './components/Navbar.jsx'
import FirstHero from './components/Hero/FirstHero'
import SecondHero from './components/Hero/SecondHero'
import ThirdHero  from './components/Hero/ThirdHero'
import FourthHero from './components/Hero/FourthHero'
import Footer from './components/Footer'
import {Route,Routes, useNavigate} from 'react-router-dom'
import Search from './components/Search'
import AOS from 'aos';import 'aos/dist/aos.css';
import { useEffect } from 'react'
import FundraisingDetails from './components/Hero/FundraisingDetails'
import Create from './components/Create'
import { Toaster } from 'react-hot-toast'

function Body(){
  useEffect(()=>{
    AOS.init()
  },[])
  return <>
    <FirstHero/>
    <SecondHero/>
    <ThirdHero/>
    <FourthHero/>
    <Footer/>
    
  </>
}
function App() {
  return (
    <div className="App">
      <Toaster
        position="bottom-left"
        reverseOrder={false}
      />
      <Routes>

       <Route path="/" element={
         <>
         <NavBar/>
          <Body/>
         </>
       }/>

       <Route path="/search" element={<>
        <NavBar/>
        <Search/>
       </>}/>

       <Route path="/details" element={<>
        <NavBar/>
        <FundraisingDetails/>
        <Footer/>
       </>}/>

       <Route path="/create" element={<Create/>}/>
       
      </Routes>
    </div>
  )
}

export default App
