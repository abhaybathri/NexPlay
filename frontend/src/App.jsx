import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { CategoryTabs, Header } from './components/index.js'
import { AllVideos, Home } from './pages/index.js'
import { Outlet } from 'react-router-dom'
import { api } from './api/axios.js'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { login, logout } from './store/authSlice.js'

function App() {
  const [count, setCount] = useState(0)
    const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const { data } = await api.get("/users/user");


            dispatch(login(data.data));
        } catch (err) {
            console.log("Error:", err.response?.data || err.message);
            dispatch(logout());
        }
    };

    checkAuth();
}, []);

  return (
    <>
    <Header />
    <Outlet />    
        
    </>
  )
}

export default App
