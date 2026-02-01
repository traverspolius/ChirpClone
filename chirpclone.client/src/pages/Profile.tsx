import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Post, User } from "../types";
import PostCard from "../components/posts/PostCard";

export default function Profile() {
    const { handle } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    const load = async () => {
        const u = await api.get(`/users/${handle}`);
        setUser(u.data);
        const p = await api.get<Post[]>(`/users/${handle}/posts`);
        setPosts(p.data);
    };

    useEffect(() => { void load(); }, [handle]);

    return (
        <div>
            <div className="chirp-header">{user?.displayName ?? "Profile"}</div>

            <div className="bg-light" style={{ height: 140 }} />
            <div className="px-3">
                <div className="d-flex justify-content-between" style={{ marginTop: -28 }}>
                    <div className="avatar-md" style={{ outline: "4px solid #fff" }} />
                    <button className="btn btn-outline-secondary rounded-pill mt-3">Edit profile</button>
                </div>

                <div className="mt-2">
                    <div className="fw-bold h5 mb-0">{user?.displayName}</div>
                    <div className="text-muted">@{user?.handle}</div>

                    <div className="alert alert-warning mt-3 mb-3">
                        You aren’t verified yet (mock).
                    </div>

                    <div className="text-muted small">Joined {new Date().toLocaleDateString()} · 0 Following · 0 Followers</div>
                </div>

                <div className="mt-3">
                    {posts.map(p => <PostCard key={p.id} post={p} onVoted={load} />)}
                </div>
            </div>
        </div>
    );
}
