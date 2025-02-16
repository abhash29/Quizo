import './App.css'

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import CreateQuiz from './pages/CreateQuiz';
import DashBoard from "./pages/DashBoard";
import EditPage from './pages/EditPage';
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
          <Route path="/createQuiz" element={<CreateQuiz />} />
          <Route path="/editPage" element={<EditPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
