import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login, register } = useAuth();
    const nav = useNavigate();

    const [mode, setMode] = useState<"login" | "register">("login");
    const [emailOrHandle, setEmailOrHandle] = useState("");
    const [password, setPassword] = useState("");

    // register fields
    const [handle, setHandle] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");

    const submit = async () => {
        if (mode === "login") {
            await login(emailOrHandle, password);
        } else {
            await register(handle, displayName, email, password);
        }
        nav("/home", { replace: true });
    };

    return (
        <div className="container">
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="card" style={{ width: 520, borderRadius: 16 }}>
                    <div className="card-body p-4">
                        <div className="text-center fw-bold h4 mb-3">
                            {mode === "login" ? "Sign in to Chirp" : "Create your account"}
                        </div>

                        <button className="btn btn-outline-dark w-100 rounded-pill mb-3" disabled>
                            Sign in with Apple (mock)
                        </button>

                        {mode === "login" ? (
                            <>
                                <input className="form-control mb-2" placeholder="Phone/email/username"
                                    value={emailOrHandle} onChange={(e) => setEmailOrHandle(e.target.value)} />
                                <input className="form-control mb-2" type="password" placeholder="Password"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />

                                <button className="btn btn-dark w-100 rounded-pill" onClick={submit}>Next</button>
                                <button className="btn btn-link w-100 mt-2">Forgot password?</button>

                                <div className="text-center mt-3">
                                    <span className="text-muted">Don’t have an account? </span>
                                    <button className="btn btn-link p-0" onClick={() => setMode("register")}>Sign up</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <input className="form-control mb-2" placeholder="Handle (no @)"
                                    value={handle} onChange={(e) => setHandle(e.target.value)} />
                                <input className="form-control mb-2" placeholder="Display name"
                                    value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                <input className="form-control mb-2" placeholder="Email"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input className="form-control mb-2" type="password" placeholder="Password (min 8)"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />

                                <button className="btn btn-dark w-100 rounded-pill" onClick={submit}>Create account</button>

                                <div className="text-center mt-3">
                                    <span className="text-muted">Already have an account? </span>
                                    <button className="btn btn-link p-0" onClick={() => setMode("login")}>Sign in</button>
                                </div>
                            </>
                        )}

                        <div className="d-flex flex-wrap gap-3 text-muted small mt-4 justify-content-center">
                            <span>About</span><span>Help</span><span>Privacy</span><span>Terms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
