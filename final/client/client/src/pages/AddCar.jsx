import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AddCar() {
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    transmission: "",
    bodyStyle: "",
    notes: ""
  });

  const [message, setMessage] = useState("");

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setMessage("");

    if (!form.make || !form.model || !form.year) {
      setMessage("Make, model, and year are required.");
      return;
    }

    const res = await fetch(`${API}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Car added successfully!");
      setForm({
        make: "",
        model: "",
        year: "",
        transmission: "",
        bodyStyle: "",
        notes: ""
      });
    } else {
      setMessage(data.error || "Error adding car.");
    }
  }

  return (
    <div className="page add">
      <div className="add-hero">
        <img
          src="/sports-car-2.png"
          alt="Sports car and SUV illustration"
          className="add-hero-image"
        />
      </div>

      <h1 className="add-title">Add a Car</h1>
      <p className="add-intro">You can add cars to your car collection here.</p>

      {message && <p className="message">{message}</p>}

      <form onSubmit={submit} className="add-form">
        <div className="form-row">
          <input
            name="make"
            placeholder="Make"
            value={form.make}
            onChange={updateField}
            required
          />
          <input
            name="model"
            placeholder="Model"
            value={form.model}
            onChange={updateField}
            required
          />
          <input
            name="bodyStyle"
            placeholder="Body style"
            value={form.bodyStyle}
            onChange={updateField}
          />
        </div>

        <div className="form-row">
          <input
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={updateField}
            required
          />
          <input
            name="transmission"
            placeholder="Transmission"
            value={form.transmission}
            onChange={updateField}
          />
        </div>

        <div className="form-row form-row-notes">
          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={updateField}
            className="notes-textarea"
          />
        </div>

        <button type="submit">Add Car</button>
      </form>
    </div>
  );
}
