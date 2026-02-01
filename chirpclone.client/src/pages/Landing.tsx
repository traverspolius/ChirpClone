import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-light">
                    <div style={{ fontSize: 64, fontWeight: 900 }}>Chirp</div>
                </div>

                <div className="col-12 col-lg-6 d-flex align-items-center">
                    <div className="p-5 w-100" style={{ maxWidth: 520 }}>
                        <div className="display-5 fw-bold">Happening now</div>
                        <div className="h3 fw-bold mt-3">Join today.</div>

                        <button className="btn btn-outline-dark w-100 rounded-pill mt-3" disabled>
                            Sign up with Apple (mock)
                        </button>

                        <div className="text-center text-muted small mt-2">or</div>

                        <Link to="/login" className="btn btn-dark w-100 rounded-pill mt-2">
                            Create account / Sign in
                        </Link>

                        <div className="text-muted small mt-4">
                            By signing up, you agree to our Terms (mock).
                        </div>

                        <div className="d-flex flex-wrap gap-3 text-muted small mt-5">
                            <span>About</span><span>Help Center</span><span>Privacy</span><span>Terms</span><span>Ads</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
