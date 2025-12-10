import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Car Collection</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/cars">Cars</Link>
        <Link to="/add">Add Car</Link>
      </div>
    </nav>
  );
}