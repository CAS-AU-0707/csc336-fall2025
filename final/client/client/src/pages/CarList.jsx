import { useEffect, useState } from "react";
import CarCard from "../components/CarCard.jsx";
import SearchBar from "../components/SearchBar.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");

  async function fetchCars() {
    const res = await fetch(`${API}/api/items`);
    const data = await res.json();
    setCars(data);
  }

  async function deleteCar(id) {
    await fetch(`${API}/api/items/${id}`, { method: "DELETE" });
    fetchCars();
  }

  useEffect(() => {
    fetchCars();
  }, []);

  const filtered = cars.filter((car) => {
    const text = `${car.make} ${car.model} ${car.year} ${car.transmission} ${car.bodyStyle} ${car.notes}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="page list">
      <h1>Your Cars</h1>
      <SearchBar value={search} onChange={setSearch} />

      <div className="car-grid">
        {filtered.length === 0 && <p>No cars found.</p>}

        {filtered.map((car) => (
          <CarCard key={car.id} car={car} onDelete={deleteCar} />
        ))}
      </div>
    </div>
  );
}