import { useState } from "react";
import {
  AlertTriangle,
  FileText,
  MapPin,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app">
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
        <aside className="sidebar">
          <button
            className={activePage === "dashboard" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("dashboard")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            className={activePage === "report" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("report")}
          >
            <PlusCircle size={20} />
            Report Issue
          </button>

          <button
            className={activePage === "issues" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("issues")}
          >
            <FileText size={20} />
            Issues
          </button>
        </aside>

        <main className="main-content">
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

              <div className="stats-grid">
                <div className="stat-card">
                  <span>Total Issues</span>
                  <strong>1</strong>
                </div>

                <div className="stat-card">
                  <span>High Severity</span>
                  <strong>1</strong>
                </div>

                <div className="stat-card">
                  <span>Pending</span>
                  <strong>1</strong>
                </div>

                <div className="stat-card">
                  <span>Locations</span>
                  <strong>1</strong>
                </div>
              </div>

              <section className="content-card">
                <div className="card-header">
                  <div>
                    <h2>Recent Community Issues</h2>
                    <p>Latest reported problems</p>
                  </div>

                  <MapPin size={22} />
                </div>

                <div className="issue-row">
                  <div>
                    <h3>Large pothole on main road</h3>
                    <p>Main Road</p>
                  </div>

                  <span className="severity high">High</span>
                </div>
              </section>
            </>
          )}

          {activePage === "report" && (
            <section className="content-card">
              <h1>Report an Issue</h1>
              <p>
                Upload a photo and describe a community problem.
              </p>
            </section>
          )}

          {activePage === "issues" && (
            <section className="content-card">
              <h1>Community Issues</h1>
              <p>
                View reported issues and their current status.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
