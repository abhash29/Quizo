import './App.css'

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import DashBoard from "./pages/DashBoard";
import Login from './pages/Login'
import SignUp from './pages/Signup'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
