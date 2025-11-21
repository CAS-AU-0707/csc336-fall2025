export default function About() {
    return (
        <section className="card about-card">
            <h1 className="about-title">
                About this project
            </h1>

            <p className="about-body">
                This small site was built as part of a React assignment. The idea was to
                practice components, props, state, routing, and loading data from an API,
                but also have the layout feel a bit more like a modern UX or product site.
            </p>

            <p className="about-body">
                The Home page manages a list of places I want to visit. The Dog Gallery
                page calls a public API to grab a few random dog pictures. Everything is
                wired together with React Router.
            </p>

            <div className="about-grid">
                <div className="about-block">
                    <h3 className="about-number">3</h3>
                    <p className="about-label">Pages</p>
                </div>

                <div className="about-block">
                    <h3 className="about-number">5+</h3>
                    <p className="about-label">Components</p>
                </div>

                <div className="about-block">
                    <h3 className="about-number">1</h3>
                    <p className="about-label">External API</p>
                </div>
            </div>
        </section>
    );
}
