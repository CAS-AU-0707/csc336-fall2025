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

    // Simple client-side validation
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
      <h1>Add a Car</h1>

      {message && <p className="message">{message}</p>}

      <form onSubmit={submit}>
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
        <input
          name="bodyStyle"
          placeholder="Body Style"
          value={form.bodyStyle}
          onChange={updateField}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={updateField}
        />
        <button type="submit">Add Car</button>
      </form>
    </div>
  );
}
