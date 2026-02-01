import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";

export default function AppShell({ center }: { center: JSX.Element }) {
    return (
        <div className="container-xl">
            <div className="row gx-4">
                <div className="col-3 d-none d-lg-block"><Sidebar /></div>
                <div className="col-12 col-lg-6"><div className="chirp-center">{center}</div></div>
                <div className="col-3 d-none d-lg-block"><RightPanel /></div>
            </div>
        </div>
    );
}
