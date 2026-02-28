import React, { useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import MainRouter from './routes/MainRouter'
import { useDispatch } from 'react-redux'
import api from './utils/api'
import { clearUser, setUser } from './store/slice/authSlice'

const App = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const checkAuth = async ()=>{
      try {
        const res = await api.get("/auth/me");
        dispatch(setUser(res.data.user));
      } catch (error) {
        dispatch(clearUser());
      }
    }
    checkAuth();
  },[dispatch])
  return (
    <div className='relative w-full min-h-screen bg-black'>
      {/* Nav-bar */}
      <Navbar/>
      <MainRouter/>
    </div>
  )
}

export default App