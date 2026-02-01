import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { NotificationItem } from "../types";

export default function Notifications() {
    const [items, setItems] = useState<NotificationItem[]>([]);

    useEffect(() => {
        void (async () => {
            const { data } = await api.get<NotificationItem[]>("/notifications");
            setItems(data);
        })();
    }, []);

    return (
        <div>
            <div className="chirp-header">Notifications</div>
            <div className="p-3">
                {items.length === 0 ? (
                    <div className="card"><div className="card-body text-muted">No notifications yet.</div></div>
                ) : items.map(n => (
                    <div key={n.id} className="card mb-2">
                        <div className="card-body">
                            <div className="fw-semibold">{n.message}</div>
                            <div className="text-muted small">{new Date(n.createdAtUtc).toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
