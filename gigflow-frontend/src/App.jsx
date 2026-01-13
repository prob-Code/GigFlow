import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import GigDetails from "./pages/GigDetails";
import PostGig from "./pages/PostGig";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pt-20 selection:bg-[#108a00]/10">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Gigs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<PostGig />} />
          <Route path="/gigs/:id" element={<GigDetails />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
