export default function DashboardLoading() {
  return (
    <div className="ds-page" role="status" aria-label="Loading workspace">
      <span className="sr-only">Loading your workspace…</span>
      <div className="ps-loading-line" />
      <div className="ps-quick-grid">
        {[0, 1, 2, 3].map((item) => <div key={item} className="ps-loading-card" />)}
      </div>
      <div className="ps-loading-panel" />
    </div>
  );
}
