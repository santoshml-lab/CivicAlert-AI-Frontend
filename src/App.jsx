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

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

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
    issues.map((issue) => issue.location).filter(Boolean)
  ).size;

  const latestIssue = issues.length > 0 ? issues[0] : null;

  const handlePhotoUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadMessage("Please select an image first.");
      return;
    }

    setUploading(true);
    setUploadMessage("");

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_URL}/upload-photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Photo upload failed");
      }

      const data = await response.json();

      console.log("Upload response:", data);

      setUploadMessage(
      "Photo uploaded to Supabase Storage successfully."
);
        
      
    } catch (error) {
      console.error("Photo upload error:", error);

      setUploadMessage(
        "Unable to upload photo. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

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
                  <p>{error}</p>
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
                        {latestIssue.location ||
                          "Location not provided"}
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

          {activePage === "report" && (
            <section className="content-card">
              <h1>Report an Issue</h1>

              <p>
                Submit a community problem for AI-powered analysis.
              </p>

              <form
                onSubmit={handlePhotoUpload}
                style={{
                  marginTop: "24px",
                  display: "grid",
                  gap: "18px",
                }}
              >
                <div>
                  <label>Issue Photo</label>

                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    required
                    onChange={(event) => {
                      setSelectedFile(
                        event.target.files[0]
                      );

                      setUploadMessage("");
                    }}
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

                {selectedFile && (
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                    Selected: {selectedFile.name}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    padding: "13px 20px",
                    border: "none",
                    borderRadius: "9px",
                    background:
                      "linear-gradient(135deg, #2563eb, #06b6d4)",
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: uploading
                      ? "not-allowed"
                      : "pointer",
                    opacity: uploading ? 0.7 : 1,
                  }}
                >
                  {uploading
                    ? "Uploading..."
                    : "Upload Photo"}
                </button>

                {uploadMessage && (
                  <p
                    style={{
                      color: "#67e8f9",
                      fontSize: "14px",
                    }}
                  >
                    {uploadMessage}
                  </p>
                )}
              </form>
            </section>
          )}

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
                      style={{
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <h3>{issue.title}</h3>

                        <p>
                          {issue.location ||
                            "Location not provided"}
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
