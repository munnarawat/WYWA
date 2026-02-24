import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'
import Home from '../pages/Home'

const MainRouter = () => {
  return (
    <Routes>
       <Route path='/' element={<Home/>} />
       <Route path='/register' element={<Register/>} />
       <Route path='/login' element={<Login/>} />
    </Routes>
  )
}

export default MainRouter