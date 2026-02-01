import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AppShell from "./components/layout/AppShell";

function Private({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            <Route path="/home" element={<Private><AppShell center={<Home />} /></Private>} />
            <Route path="/explore" element={<Private><AppShell center={<Explore />} /></Private>} />
            <Route path="/notifications" element={<Private><AppShell center={<Notifications />} /></Private>} />
            <Route path="/:handle" element={<Private><AppShell center={<Profile />} /></Private>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
