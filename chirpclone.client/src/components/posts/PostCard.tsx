import type { Post } from "../../types";
import { api } from "../../api/client";

export default function PostCard({ post, onVoted }: { post: Post; onVoted: () => void }) {
    const vote = async (pollId: string, optionId: string) => {
        await api.post(`/polls/${pollId}/vote/${optionId}`);
        onVoted();
    };

    return (
        <div className="card mb-2">
            <div className="card-body">
                <div className="d-flex gap-2">
                    <div className="avatar-sm" />
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="fw-semibold">{post.author.displayName}</span>{" "}
                                <span className="text-muted">@{post.author.handle}</span>{" "}
                                <span className="text-muted">· {new Date(post.createdAtUtc).toLocaleDateString()}</span>
                            </div>
                            <button className="btn btn-sm btn-light">…</button>
                        </div>

                        <div className="mt-2" style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>

                        {post.poll && (
                            <div className="mt-3">
                                {post.poll.options.map(o => (
                                    <button key={o.id}
                                        className="btn btn-outline-secondary w-100 text-start mt-2"
                                        onClick={() => vote(post.poll!.id, o.id)}>
                                        {o.optionText}
                                        <span className="text-muted float-end">{o.voteCount}</span>
                                    </button>
                                ))}
                                <div className="text-muted small mt-2">
                                    Poll ends {new Date(post.poll.expiresAtUtc).toLocaleString()}
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-between text-muted mt-3">
                            <span>💬</span><span>🔁</span><span>♡</span><span>📊</span><span>🔖</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
