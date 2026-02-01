export default function Modal({
    open, onClose, title, children
}: {
    open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="chirp-backdrop" role="dialog" aria-modal="true">
            <div className="chirp-modal card">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                        <button className="btn btn-sm btn-light" onClick={onClose}>×</button>
                        <div className="fw-bold">{title}</div>
                        <div style={{ width: 32 }} />
                    </div>
                    <div className="mt-3">{children}</div>
                </div>
            </div>
        </div>
    );
}
