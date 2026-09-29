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
      Submit a community problem for AI-powered analysis.
    </p>

    <form
      onSubmit={async (event) => {
        <div>
  <label>Issue Photo</label>

  <input
    type="file"
    name="photo"
    accept="image/*"
    style={{
      width: "100%",
      marginTop: "8px",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #334155",
      background: "#0f172a",
      color: "#cbd5e1",
    }}
  />
</div>
        event.preventDefault();

        const formData = new FormData(event.target);

        const issue = {
          title: formData.get("title"),
          description: formData.get("description"),
          category: formData.get("category"),
          severity: formData.get("severity"),
          location: formData.get("location"),
        };

        try {
          const response = await fetch(`${API_URL}/issues`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(issue),
          });

          if (!response.ok) {
            throw new Error("Failed to submit issue");
          }

          alert("Issue reported successfully!");

          event.target.reset();

          const refreshedResponse = await fetch(
            `${API_URL}/issues`
          );

          const refreshedData = await refreshedResponse.json();

          setIssues(refreshedData.issues || []);

          setActivePage("dashboard");
        } catch (error) {
          console.error("Failed to submit issue:", error);

          alert("Unable to report issue. Please try again.");
        }
      }}
      style={{
        marginTop: "24px",
        display: "grid",
        gap: "18px",
      }}
    >
      <div>
        <label>Issue Title</label>

        <input
          type="text"
          name="title"
          placeholder="Example: Large pothole on main road"
          required
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#f8fafc",
          }}
        />
      </div>

      <div>
        <label>Description</label>

        <textarea
          name="description"
          placeholder="Describe the community issue..."
          rows="5"
          required
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#f8fafc",
            resize: "vertical",
          }}
        />
      </div>

      <div>
        <label>Category</label>

        <select
          name="category"
          required
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#f8fafc",
          }}
        >
          <option value="">Select category</option>
          <option value="road">Road</option>
          <option value="garbage">Garbage</option>
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
          <option value="streetlight">Streetlight</option>
          <option value="drainage">Drainage</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label>Severity</label>

        <select
          name="severity"
          required
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#f8fafc",
          }}
        >
          <option value="">Select severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label>Location</label>

        <input
          type="text"
          name="location"
          placeholder="Example: Main Road"
          required
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#f8fafc",
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: "13px 20px",
          border: "none",
          borderRadius: "9px",
          background: "linear-gradient(135deg, #2563eb, #06b6d4)",
          color: "#ffffff",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Submit Issue
      </button>
    </form>
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
