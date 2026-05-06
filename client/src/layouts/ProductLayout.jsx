import TopBar from "../components/layout/TopBar";

export default function ProductLayout({ children }) {
  return (
    <div className="app">
      <TopBar />

      <div className="app__content">
        {children}
      </div>
    </div>
  );
}
