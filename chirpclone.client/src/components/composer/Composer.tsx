import { useMemo, useState } from "react";
import { api } from "../../api/client";
import type { Post } from "../../types";
import PollComposer from "./PollComposer";

const MAX = 280;

export default function Composer({ onPosted }: { onPosted: (p: Post) => void }) {
    const [text, setText] = useState("");
    const [showPoll, setShowPoll] = useState(false);
    const [pollOptions, setPollOptions] = useState<string[] | null>(null);
    const [durationMinutes, setDurationMinutes] = useState(60);
    const [posting, setPosting] = useState(false);

    const remaining = useMemo(() => MAX - text.length, [text]);
    const postEnabled = text.trim().length > 0 && text.length <= MAX && !posting;

    const submit = async () => {
        if (!postEnabled) return;
        setPosting(true);

        const payload: any = { content: text };
        if (pollOptions) payload.poll = { options: pollOptions, durationMinutes };

        const { data } = await api.post<Post>("/posts", payload);

        onPosted(data);
        setText("");
        setPollOptions(null);
        setDurationMinutes(60);
        setPosting(false);
    };

    return (
        <div className="card">
            <div className="card-body d-flex gap-2">
                <div className="avatar-md" />
                <div className="flex-grow-1">
                    <textarea
                        className="form-control border-0 chirp-textarea"
                        placeholder="What’s happening?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                    />

                    <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="d-flex gap-2 chirp-icons">
                            <button className="btn btn-sm btn-light" disabled title="Image">🖼️</button>
                            <button className="btn btn-sm btn-light" disabled title="GIF">GIF</button>
                            <button className="btn btn-sm btn-light" title="Poll" onClick={() => setShowPoll(true)}>📊</button>
                            <button className="btn btn-sm btn-light" disabled title="Emoji">😊</button>
                            <button className="btn btn-sm btn-light" disabled title="Location">📍</button>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <div className={`small ${remaining < 0 ? "text-danger" : "text-muted"}`}>
                                {text.length}/{MAX}
                            </div>
                            <button className={`btn rounded-pill ${postEnabled ? "btn-dark" : "btn-secondary"}`}
                                disabled={!postEnabled} onClick={submit}>
                                {posting ? "Posting…" : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <PollComposer open={showPoll} onClose={() => setShowPoll(false)}
                onApply={(opts, minutes) => {
                    setPollOptions(opts);
                    setDurationMinutes(minutes);
                    setShowPoll(false);
                }} />
        </div>
    );
}
