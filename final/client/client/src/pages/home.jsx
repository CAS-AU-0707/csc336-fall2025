export default function Home() {
  return (
    <div className="page home">
      <header className="home-header">
        <h1>Welcome to Your Car Collection</h1>
      </header>

      <p className="home-tagline">
        Track your cars and your wishlist all in one place.
      </p>

      <div className="home-image-wrapper">
        <img
          src="parking-lot.jpg"
          alt="Parking lot full of cars"
          className="home-parking-image"
        />
      </div>

      <section className="home-links">
        <h2>Helpful Links</h2>
        <ul>
          <li>
            <a href="https://www.kbb.com" target="_blank" rel="noreferrer">
              Kelley Blue Book
            </a>
          </li>
          <li>
            <a href="https://www.edmunds.com" target="_blank" rel="noreferrer">
              Edmunds Car Reviews
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
