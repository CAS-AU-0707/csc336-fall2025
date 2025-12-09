import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import CarList from "./pages/CarList.jsx";
import AddCar from "./pages/AddCar.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/add" element={<AddCar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
