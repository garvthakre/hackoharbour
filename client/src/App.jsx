import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import PDFRagApp from "./pages/PDFRAGApp";
import CollaborativeSpace from "./pages/CollaborativeSpace";
import CollaborativeWorkspace from "./pages/CollaborativeWorkspace";
function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Navbar/> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/rag" element={<PDFRagApp />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/spaces"
            element={
              <PrivateRoute>
                <CollaborativeSpace />
              </PrivateRoute>
            }
          />
          <Route
            path="/space/:spaceId"
            element={
              <PrivateRoute>
                <CollaborativeWorkspace />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={<h1 className="text-red-600">Wrong Route</h1>}
          />
        </Routes>
        {/* <Footer/> */}
      </BrowserRouter>
    </>
  );
}

export default App;
