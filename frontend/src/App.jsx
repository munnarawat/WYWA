import React, { useEffect, useState } from 'react'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import MainRouter from './routes/MainRouter'
import { useDispatch } from 'react-redux'
import api from './utils/api'
import { clearUser, setUser } from './store/slice/authSlice'
import { Loader } from 'lucide-react'
import Footer from './components/Footer'

const App = () => {
  const dispatch = useDispatch();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  useEffect(()=>{
    const checkAuth = async ()=>{
      try {
        const res = await api.get("/auth/me");
        dispatch(setUser(res.data.user));
      } catch (error) {
        dispatch(clearUser());
      }finally{
        setIsAuthChecking(false);
      }
    }
    checkAuth();
  },[dispatch])
  if(isAuthChecking){
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center text-white">
        <Loader size={48} className='text-teal-400 animate-spin'  />
      </div>
    )
  }
  return (
    <div className='relative w-full min-h-screen bg-black'>
      {/* Nav-bar */}
      <Navbar/>
      <MainRouter/>
      <Footer/>
    </div>
  )
}

export default App