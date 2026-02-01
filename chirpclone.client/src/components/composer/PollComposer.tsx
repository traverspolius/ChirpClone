import { useMemo, useState } from "react";
import Modal from "../common/Modal";

export default function PollComposer({
    open, onClose, onApply
}: {
    open: boolean;
    onClose: () => void;
    onApply: (options: string[], durationMinutes: number) => void;
}) {
    const [opts, setOpts] = useState(["", ""]);
    const [minutes, setMinutes] = useState(60);

    const canAdd = opts.length < 4;
    const canApply = useMemo(() => opts.filter(o => o.trim().length > 0).length >= 2, [opts]);

    const setOpt = (i: number, v: string) => setOpts(prev => prev.map((x, idx) => idx === i ? v : x));

    return (
        <Modal open={open} onClose={onClose} title="Create a poll">
            <div className="mb-2 text-muted small">Add 2–4 options and choose duration.</div>

            {opts.map((o, i) => (
                <input
                    key={i}
                    className="form-control mt-2"
                    placeholder={`Choice ${i + 1}`}
                    value={o}
                    maxLength={80}
                    onChange={(e) => setOpt(i, e.target.value)}
                />
            ))}

            <div className="d-flex gap-2 mt-3">
                <button className="btn btn-outline-secondary rounded-pill" disabled={!canAdd} onClick={() => setOpts(p => [...p, ""])}>
                    Add choice
                </button>

                <select className="form-select" value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value, 10))}>
                    <option value={5}>5 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={240}>4 hours</option>
                    <option value={1440}>1 day</option>
                    <option value={4320}>3 days</option>
                    <option value={10080}>7 days</option>
                </select>
            </div>

            <button className="btn btn-dark rounded-pill w-100 mt-3" disabled={!canApply}
                onClick={() => onApply(opts.map(x => x.trim()).filter(x => x.length > 0), minutes)}>
                Apply poll
            </button>
        </Modal>
    );
}
