import { useEffect, useState } from "react";

export default function DogGallery() {
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function fetchDogs() {
        try {
            setStatus("loading");
            setErrorMessage("");

            const response = await fetch(
                "https://dog.ceo/api/breeds/image/random/8"
            );
            const data = await response.json();

            if (data.status !== "success") {
                throw new Error("API did not respond as expected.");
            }

            setImages(data.message);
            setStatus("idle");
        } catch (err) {
            setStatus("error");
            setErrorMessage(err.message || "Something went wrong.");
        }
    }

    useEffect(() => {
        fetchDogs();
    }, []);

    return (
        <section className="card gallery-card">
            <div className="gallery-header">
                <h1>Dog Gallery</h1>
                <p className="gallery-subtitle">
                    Simple gallery with images loaded from the Dog API using useEffect.
                </p>

                <button className="btn gallery-btn" onClick={fetchDogs}>
                    Refresh Images
                </button>
            </div>

            {status === "loading" && (
                <p className="loading">Loading new dogs...</p>
            )}

            {status === "error" && (
                <p className="error">Error: {errorMessage}</p>
            )}

            <div className="dog-grid">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Dog ${index + 1}`}
                        className="dog-image gallery-image"
                    />
                ))}
            </div>
        </section>
    );
}
