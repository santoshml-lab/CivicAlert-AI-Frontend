import { useEffect, useState } from "react";
import {
  AlertTriangle,
  FileText,
  MapPin,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";

const API_URL = "https://civicalert-ai.onrender.com";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/issues`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch issues");
        }

        return response.json();
      })
      .then((data) => {
        setIssues(data.issues || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch issues:", error);
        setError("Unable to load community issues.");
        setLoading(false);
      });
  }, []);

  const totalIssues = issues.length;

  const highSeverityIssues = issues.filter(
    (issue) => issue.severity?.toLowerCase() === "high"
  ).length;

  const pendingIssues = issues.filter(
    (issue) => issue.status?.toLowerCase() === "pending"
  ).length;

  const uniqueLocations = new Set(
    issues
      .map((issue) => issue.location)
      .filter(Boolean)
  ).size;

  const latestIssue = issues.length > 0 ? issues[0] : null;

  return (
    <div className="app">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="brand">
          <AlertTriangle size={28} />
          <span>CivicAlert AI</span>
        </div>

        <div className="topbar-subtitle">
          Community Issue Intelligence
        </div>
      </header>

      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("dashboard")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            className={
              activePage === "report"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("report")}
          >
            <PlusCircle size={20} />
            Report Issue
          </button>

          <button
            className={
              activePage === "issues"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("issues")}
          >
            <FileText size={20} />
            Issues
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">

          {/* DASHBOARD */}
          {activePage === "dashboard" && (
            <>
              <div className="page-header">
                <div>
                  <h1>Community Dashboard</h1>

                  <p>
                    Monitor and understand local community issues.
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div className="stats-grid">

                <div className="stat-card">
                  <span>Total Issues</span>

                  <strong>
                    {loading ? "..." : totalIssues}
                  </strong>
                </div>

                <div className="stat-card">
                  <span>High Severity</span>

                  <strong>
                    {loading ? "..." : highSeverityIssues}
                  </strong>
                </div>

                <div className="stat-card">
                  <span>Pending</span>

                  <strong>
                    {loading ? "..." : pendingIssues}
                  </strong>
                </div>

                <div className="stat-card">
                  <span>Locations</span>

                  <strong>
                    {loading ? "..." : uniqueLocations}
                  </strong>
                </div>

              </div>

              {/* RECENT ISSUES */}
              <section className="content-card">

                <div className="card-header">
                  <div>
                    <h2>Recent Community Issues</h2>

                    <p>
                      Latest reported problems
                    </p>
                  </div>

                  <MapPin size={22} />
                </div>

                {loading && (
                  <p>
                    Loading community issues...
                  </p>
                )}

                {!loading && error && (
                  <p>
                    {error}
                  </p>
                )}

                {!loading && !error && !latestIssue && (
                  <p>
                    No community issues reported yet.
                  </p>
                )}

                {!loading && !error && latestIssue && (
                  <div className="issue-row">

                    <div>
                      <h3>
                        {latestIssue.title}
                      </h3>

                      <p>
                        {latestIssue.location || "Location not provided"}
                      </p>
                    </div>

                    <span
                      className={`severity ${
                        latestIssue.severity?.toLowerCase() || ""
                      }`}
                    >
                      {latestIssue.severity || "Unknown"}
                    </span>

                  </div>
                )}

              </section>
            </>
          )}

          {/* REPORT ISSUE */}
          {activePage === "report" && (
            <section className="content-card">
              <h1>Report an Issue</h1>

              <p>
                Upload a photo and describe a community problem.
              </p>
            </section>
          )}

          {/* ISSUES */}
          {activePage === "issues" && (
            <section className="content-card">
              <h1>Community Issues</h1>

              <p>
                View reported issues and their current status.
              </p>

              {!loading && issues.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  {issues.map((issue) => (
                    <div
                      className="issue-row"
                      key={issue.id}
                      style={{ marginBottom: "12px" }}
                    >
                      <div>
                        <h3>{issue.title}</h3>

                        <p>
                          {issue.location || "Location not provided"}
                        </p>
                      </div>

                      <span
                        className={`severity ${
                          issue.severity?.toLowerCase() || ""
                        }`}
                      >
                        {issue.severity || "Unknown"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!loading && issues.length === 0 && (
                <p style={{ marginTop: "20px" }}>
                  No issues found.
                </p>
              )}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
