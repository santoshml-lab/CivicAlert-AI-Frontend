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
                  </
