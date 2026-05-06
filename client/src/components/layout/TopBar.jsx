import { useNavigate, useLocation } from "react-router-dom";

export default function TopBar() {
  const nav = useNavigate();
  const loc = useLocation();

  const isAI = loc.pathname.includes("upgr-ai");
  const isED = loc.pathname.includes("upgr-ed");

  return (
    <div className="topbar">
      <div className="topbar__logo" onClick={() => nav("/")}>
        UpgrAIEd
      </div>

      <div className="topbar__menu">
        <div onClick={() => nav("/upgraied")}>
          🤖 UpGrAIEd
        </div>

        <div className="disabled">
          🎓 UpGrEd (Coming Soon)
        </div>
      </div>
    </div>
  );
}
