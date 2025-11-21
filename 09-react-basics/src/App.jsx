import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import HomeList from "./components/HomeList.jsx";
import About from "./components/About.jsx";
import DogGallery from "./components/DogGallery.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <h1 className="app-title">Trip Planner</h1>

        <nav className="nav">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/dogs" className="nav-link">
            Dog Gallery
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomeList />} />
          <Route path="/about" element={<About />} />
          <Route path="/dogs" element={<DogGallery />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
