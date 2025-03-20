import {BrowserRouter, Routes, Route} from "react-router";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";


function App() {

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />




      <Route path="*" element={<h1 className="text-red-600">Wrong Route</h1>} />
    </Routes>
    <Footer/>
  </BrowserRouter>
      
        
    </>
  )
}

export default App
