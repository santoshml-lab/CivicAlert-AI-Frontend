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
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/issues`);

      if (!response.ok) {
        throw new Error("Failed to fetch issues");
      }

      const data = await response.json();

      setIssues(data.issues || []);
      setError("");
    } catch (error) {
      console.error("Failed to fetch issues:", error);

      setError("Unable to load community issues.");
    } finally {
      setLoading(false);
    }
  };

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
    setAiResult(null);

    try {
      // --------------------------------
      // STEP 1: Upload photo
      // --------------------------------

      const formData = new FormData();

      formData.append("file", selectedFile);

      const uploadResponse = await fetch(
        `${API_URL}/upload-photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Photo upload failed");
      }

      const uploadData = await uploadResponse.json();

      console.log("Storage upload:", uploadData);

      // Make sure backend returned image URL
      if (!uploadData.image_url) {
        throw new Error(
          "Image URL was not returned by the server"
        );
      }

      setUploadMessage(
        "Photo uploaded. AI is analyzing the image..."
      );

      // --------------------------------
      // STEP 2: AI image analysis
      // --------------------------------

      const analyzeResponse = await fetch(
        `${API_URL}/analyze-image?image_url=${encodeURIComponent(
          uploadData.image_url
        )}`,
        {
          method: "POST",
        }
      );

      if (!analyzeResponse.ok) {
        throw new Error("AI analysis failed");
      }

      const analyzeData = await analyzeResponse.json();

      console.log("AI analysis:", analyzeData);

      // --------------------------------
      // STEP 3: Show AI result
      // --------------------------------

      setAiResult(analyzeData.analysis);

      setUploadMessage(
        "Photo analyzed successfully by CivicAlert AI."
      );

      // --------------------------------
      // STEP 4: Refresh issues
      // --------------------------------

      await fetchIssues();
    } catch (error) {
      console.error("CivicAlert AI error:", error);

      setUploadMessage(
        "Unable to analyze photo. Please try again."
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
          {/* =========================
              DASHBOARD
          ========================= */}

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

          {/* =========================
              REPORT ISSUE
          ========================= */}

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
                      setAiResult(null);
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
                    ? "AI Analyzing..."
                    : "Upload & Analyze"}
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

                {/* =========================
                    AI RESULT
                ========================= */}

                {aiResult && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "20px",
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))",
                      border:
                        "1px solid rgba(96, 165, 250, 0.25)",
                      boxShadow:
                        "0 12px 30px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "20px",
                        marginBottom: "18px",
                        color: "#f8fafc",
                      }}
                    >
                      AI Analysis
                    </h2>

                    <div
                      style={{
                        display: "grid",
                        gap: "12px",
                      }}
                    >
                      <p
                        style={{
                          color: "#cbd5e1",
                          lineHeight: "1.6",
                        }}
                      >
                        <strong
                          style={{
                            color: "#f8fafc",
                          }}
                        >
                          Issue:
                        </strong>{" "}
                        {aiResult.issue}
                      </p>

                      <p
                        style={{
                          color: "#cbd5e1",
                          lineHeight: "1.6",
                        }}
                      >
                        <strong
                          style={{
                            color: "#f8fafc",
                          }}
                        >
                          Category:
                        </strong>{" "}
                        {aiResult.category}
                      </p>

                      <p
                        style={{
                          color: "#cbd5e1",
                          lineHeight: "1.6",
                        }}
                      >
                        <strong
                          style={{
                            color: "#f8fafc",
                          }}
                        >
                          Severity:
                        </strong>{" "}
                        <span
                          className={`severity ${
                            aiResult.severity?.toLowerCase() || ""
                          }`}
                        >
                          {aiResult.severity}
                        </span>
                      </p>

                      <p
                        style={{
                          color: "#cbd5e1",
                          lineHeight: "1.7",
                        }}
                      >
                        <strong
                          style={{
                            color: "#f8fafc",
                          }}
                        >
                          Explanation:
                        </strong>{" "}
                        {aiResult.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </section>
          )}

          {/* =========================
              ISSUES
          ========================= */}

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
                        <h3>
                          {issue.title}
                        </h3>

                        <p>
                          {issue.location ||
                            "Location not provided"}
                        </p>

                        {issue.category && (
                          <p
                            style={{
                              marginTop: "5px",
                            }}
                          >
                            Category: {issue.category}
                          </p>
                        )}
                      </div>

                      <span
                        className={`severity ${
                          issue.severity?.toLowerCase() || ""
                        }`}
                      >
                        {issue.severity ||
                          "Unknown"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!loading && issues.length === 0 && (
                <p
                  style={{
                    marginTop: "20px",
                  }}
                >
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
