import React from 'react'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import MainRouter from './routes/MainRouter'

const App = () => {
  return (
    <div className='relative w-full min-h-screen bg-black'>
      {/* Nav-bar */}
      <Navbar/>
      <MainRouter/>
    </div>
  )
}

export default App