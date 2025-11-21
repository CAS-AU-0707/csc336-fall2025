import { useState } from "react";
import ListItem from "./ListItem.jsx";

function HomeList() {
    const [items, setItems] = useState([
        { text: "Visit Tokyo", important: true },
        { text: "Road trip to Colorado", important: false },
        { text: "Weekend in New York", important: true }
    ]);

    const [newPlace, setNewPlace] = useState("");

    function handleAdd() {
        const trimmed = newPlace.trim();
        if (!trimmed) return;

        const nextItems = [
            ...items,
            {
                text: trimmed,
                important: false
            }
        ];

        setItems(nextItems);
        setNewPlace("");
    }

    return (
        <div className="home-layout">
            <section className="hero">
                <p className="hero-kicker">Trip Planner</p>
                <h1 className="hero-title">
                    Plan trips
                    <br />
                    that you actually <span className="hero-highlight">want</span> to take.
                </h1>
                <p className="hero-subtitle">
                    A small React project that keeps track of places you want to visit,
                    with a simple list on the right and a summary of your trips here.
                </p>

                <div className="hero-stats">
                    <div className="hero-stat">
                        <span className="hero-stat-number">{items.length}</span>
                        <span className="hero-stat-label">Trips in your list</span>
                    </div>
                    <div className="hero-stat">
                        <span className="hero-stat-number">3</span>
                        <span className="hero-stat-label">Example items</span>
                    </div>
                    <div className="hero-stat">
                        <span className="hero-stat-number">∞</span>
                        <span className="hero-stat-label">Ideas left to add</span>
                    </div>
                </div>
            </section>

            <section className="card planner-card">
                <h2>Places I Want to Visit</h2>

                <div className="add-form">
                    <input
                        className="text-input"
                        type="text"
                        placeholder="Add a new place..."
                        value={newPlace}
                        onChange={(e) => setNewPlace(e.target.value)}
                    />
                    <button className="btn" onClick={handleAdd}>
                        Add
                    </button>
                </div>

                <ul className="item-list">
                    {items.map((item, index) => (
                        <ListItem
                            key={index}
                            text={item.text}
                            important={item.important}
                        />
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default HomeList;
