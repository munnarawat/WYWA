import React from 'react'
import { Route, Router } from 'react-router-dom'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'
import Navbar from '../components/navbar/Navbar'

const MainRouter = () => {
  return (
    <Router>
       <Route path='/' element={""} />
       <Route path='/register' element={<Register/>} />
       <Route path='/login' element={<Login/>} />
       <Route path='/nav' element={<Navbar/>} />
    </Router>
  )
}

export default MainRouter