import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Post } from "../types";
import Composer from "../components/composer/Composer";
import PostCard from "../components/posts/PostCard";

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const { data } = await api.get<Post[]>("/timeline/home?take=35");
        setPosts(data);
        setLoading(false);
    };

    useEffect(() => { void load(); }, []);

    const onPosted = (created: Post) => setPosts(prev => [created, ...prev]);

    return (
        <div>
            <div className="chirp-header">Home</div>
            <Composer onPosted={onPosted} />

            {loading ? (
                <div className="card mt-2"><div className="card-body text-muted">Loading timeline…</div></div>
            ) : posts.length === 0 ? (
                <div className="card mt-2"><div className="card-body">
                    <div className="fw-bold">Your timeline is empty</div>
                    <div className="text-muted mt-1">Create your first post to see it appear here.</div>
                </div></div>
            ) : (
                <div className="mt-2">
                    <div className="chirp-feedback">
                        <div className="text-muted">Thanks. Chirp will use this to make your timeline better.</div>
                        <div className="fw-semibold">Undo</div>
                    </div>
                    {posts.map(p => <PostCard key={p.id} post={p} onVoted={load} />)}
                </div>
            )}
        </div>
    );
}
