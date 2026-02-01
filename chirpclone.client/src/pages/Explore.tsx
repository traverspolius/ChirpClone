export default function Explore() {
    return (
        <div>
            <div className="chirp-header">Explore</div>
            <div className="px-3 py-2">
                <ul className="nav nav-tabs">
                    <li className="nav-item"><button className="nav-link active">For you</button></li>
                    <li className="nav-item"><button className="nav-link">Trending</button></li>
                    <li className="nav-item"><button className="nav-link">News</button></li>
                    <li className="nav-item"><button className="nav-link">Sports</button></li>
                    <li className="nav-item"><button className="nav-link">Entertainment</button></li>
                </ul>
                <div className="card mt-3"><div className="card-body">Explore feed (mock). Use Right Panel for trending/news.</div></div>
            </div>
        </div>
    );
}
