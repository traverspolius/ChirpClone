import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { TrendingTopic, NewsItem, FollowSuggestion } from "../../types";

export default function RightPanel() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [trending, setTrending] = useState<TrendingTopic[]>([]);
    const [who, setWho] = useState<FollowSuggestion[]>([]);

    useEffect(() => {
        void (async () => {
            const [n, t, w] = await Promise.all([
                api.get("/explore/news"),
                api.get("/explore/trending"),
                api.get("/explore/who-to-follow"),
            ]);
            setNews(n.data);
            setTrending(t.data);
            setWho(w.data);
        })();
    }, []);

    return (
        <div className="sticky-top" style={{ top: 12 }}>
            <div className="p-3">
                <input className="form-control rounded-pill" placeholder="Search" />

                <div className="card mt-3">
                    <div className="card-body">
                        <div className="fw-bold">Subscribe to Premium</div>
                        <div className="text-muted small mt-1">Unlock new features (mock).</div>
                        <button className="btn btn-primary rounded-pill mt-2">Subscribe</button>
                    </div>
                </div>

                <div className="card mt-3">
                    <div className="card-body">
                        <div className="fw-bold">Today’s News</div>
                        {news.map((n, i) => (
                            <div key={i} className="mt-3">
                                <div className="fw-semibold">{n.title}</div>
                                <div className="text-muted small">{n.age} · {n.category} · {n.posts.toLocaleString()} posts</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card mt-3">
                    <div className="card-body">
                        <div className="fw-bold">What’s happening</div>
                        {trending.map((t, i) => (
                            <div key={i} className="mt-3">
                                <div className="text-muted small">{t.category} · Trending</div>
                                <div className="fw-semibold">{t.topic}</div>
                                <div className="text-muted small">{t.posts.toLocaleString()} posts</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card mt-3">
                    <div className="card-body">
                        <div className="fw-bold">You might like</div>
                        {who.map((w, i) => (
                            <div key={i} className="d-flex align-items-center justify-content-between mt-3">
                                <div>
                                    <div className="fw-semibold">{w.displayName}</div>
                                    <div className="text-muted small">@{w.handle}</div>
                                </div>
                                <button className="btn btn-dark btn-sm rounded-pill">Follow</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
