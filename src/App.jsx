import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router" ;  
import Chat from './components/chat.jsx';
import LoginScreen from './components/login.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<LoginScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
