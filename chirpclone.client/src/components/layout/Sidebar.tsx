import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";
import { useState } from "react";

export default function Sidebar() {
    const { user, logout } = useAuth();
    const [showLogout, setShowLogout] = useState(false);
    const nav = useNavigate();

    const doLogout = async () => {
        await logout();
        setShowLogout(false);
        nav("/", { replace: true });
    };

    return (
        <div className="sticky-top" style={{ top: 12 }}>
            <div className="p-3">
                <div className="chirp-logo mb-3">Chirp</div>

                <nav className="chirp-nav">
                    <NavLink to="/home" className="chirp-navlink">Home</NavLink>
                    <NavLink to="/explore" className="chirp-navlink">Explore</NavLink>
                    <NavLink to="/notifications" className="chirp-navlink">Notifications</NavLink>
                    <span className="chirp-navlink disabled">Follow</span>
                    <span className="chirp-navlink disabled">Chat</span>
                    <span className="chirp-navlink disabled">Grok (mock)</span>
                    <span className="chirp-navlink disabled">Bookmarks</span>
                    <span className="chirp-navlink disabled">Creator Studio</span>
                    <span className="chirp-navlink disabled">Premium</span>
                    {user && <NavLink to={`/${user.handle}`} className="chirp-navlink">Profile</NavLink>}
                    <button className="chirp-navlink btn btn-link text-start p-0" onClick={() => setShowLogout(true)}>More</button>
                </nav>

                <button className="btn btn-dark w-100 rounded-pill mt-3" type="button">Post</button>

                {user && (
                    <div className="mt-4 d-flex align-items-center gap-2">
                        <div className="avatar-sm" />
                        <div className="flex-grow-1">
                            <div className="fw-semibold">{user.displayName}</div>
                            <div className="text-muted">@{user.handle}</div>
                        </div>
                        <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => setShowLogout(true)}>
                            Log out
                        </button>
                    </div>
                )}
            </div>

            <Modal open={showLogout} onClose={() => setShowLogout(false)} title="Log out of Chirp?">
                <p className="text-muted mb-3">You can always log back in at any time.</p>
                <button className="btn btn-dark w-100 rounded-pill" onClick={doLogout}>Log out</button>
                <button className="btn btn-outline-secondary w-100 rounded-pill mt-2" onClick={() => setShowLogout(false)}>
                    Cancel
                </button>
            </Modal>
        </div>
    );
}
