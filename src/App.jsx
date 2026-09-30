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

  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [priorityResult, setPriorityResult] = useState(null);
  const [duplicateResult, setDuplicateResult] =
  useState(null);

  const [complaint, setComplaint] = useState(null);
  const [generatingComplaint, setGeneratingComplaint] =
    useState(false);
  const [complaintMessage, setComplaintMessage] =
    useState("");

  // ==========================================
  // FETCH ISSUES
  // ==========================================

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/issues`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch issues"
        );
      }

      const data = await response.json();

      setIssues(data.issues || []);
      setError("");
    } catch (error) {
      console.error(
        "Failed to fetch issues:",
        error
      );

      setError(
        "Unable to load community issues."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER ISSUES
  // ==========================================

  const filteredIssues = issues.filter(
    (issue) => {
      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        issue.title
          ?.toLowerCase()
          .includes(search) ||
        issue.location
          ?.toLowerCase()
          .includes(search) ||
        issue.category
          ?.toLowerCase()
          .includes(search);

      const matchesSeverity =
        severityFilter === "all" ||
        issue.severity?.toLowerCase() ===
          severityFilter;

      const matchesStatus =
        statusFilter === "all" ||
        issue.status?.toLowerCase() ===
          statusFilter;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    }
  );

  // ==========================================
  // DASHBOARD ANALYTICS
  // ==========================================

  const totalIssues = issues.length;

  const highSeverityIssues =
    issues.filter(
      (issue) =>
        issue.severity?.toLowerCase() ===
        "high"
    ).length;

  const pendingIssues =
    issues.filter(
      (issue) =>
        issue.status?.toLowerCase() ===
        "pending"
    ).length;

  const uniqueLocations = new Set(
    issues
      .map((issue) => issue.location)
      .filter(Boolean)
  ).size;

  // ==========================================
  // CATEGORY ANALYTICS
  // ==========================================

  const categoryCounts = issues.reduce(
    (counts, issue) => {
      const category =
        issue.category || "other";

      counts[category] =
        (counts[category] || 0) + 1;

      return counts;
    },
    {}
  );

  const latestIssue =
    issues.length > 0
      ? issues[0]
      : null;

  // ==========================================
  // GENERATE CIVIC COMPLAINT
  // ==========================================

  const handleGenerateComplaint =
    async () => {
      if (!aiResult) {
        return;
      }

      setGeneratingComplaint(true);
      setComplaintMessage("");
      setComplaint(null);

      try {
        const params =
          new URLSearchParams({
            issue: aiResult.issue,
            category: aiResult.category,
            severity: aiResult.severity,
            location:
              location ||
              "Location not provided",
            explanation:
              aiResult.explanation,
          });

        const response = await fetch(
          `${API_URL}/generate-complaint?${params.toString()}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Complaint generation failed"
          );
        }

        const data =
          await response.json();

        if (
          data.status !== "success" ||
          !data.complaint
        ) {
          throw new Error(
            data.message ||
              "Complaint generation failed"
          );
        }

        setComplaint(
          data.complaint
        );

        setComplaintMessage(
          "Complaint generated successfully."
        );
      } catch (error) {
        console.error(
          "Complaint generation error:",
          error
        );

        setComplaintMessage(
          "Unable to generate complaint. Please try again."
        );
      } finally {
        setGeneratingComplaint(
          false
        );
      }
    };

  // ==========================================
  // PHOTO UPLOAD + AI ANALYSIS
  // ==========================================

  const handlePhotoUpload =
    async (event) => {
      event.preventDefault();

      if (!selectedFile) {
        setUploadMessage(
          "Please select an image first."
        );
        return;
      }

      if (!location.trim()) {
        setUploadMessage(
          "Please enter the issue location."
        );
        return;
      }

      setUploading(true);
      setUploadMessage("");
      setAiResult(null);
      setComplaint(null);
      setComplaintMessage("");
      setPriorityResult(null);
      setDuplicateResult(null);

      try {
        // ======================================
        // STEP 1: Upload photo
        // ======================================

        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFile
        );

        const uploadResponse =
          await fetch(
            `${API_URL}/upload-photo`,
            {
              method: "POST",
              body: formData,
            }
          );

        if (!uploadResponse.ok) {
          throw new Error(
            "Photo upload failed"
          );
        }

        const uploadData =
          await uploadResponse.json();

        console.log(
          "Storage upload:",
          uploadData
        );

        if (!uploadData.image_url) {
          throw new Error(
            "Image URL was not returned by the server"
          );
        }

        setUploadMessage(
          "Photo uploaded. AI is analyzing the image..."
        );

        // ======================================
        // STEP 2: AI analysis
        // ======================================

        const analyzeResponse =
          await fetch(
            `${API_URL}/analyze-image?image_url=${encodeURIComponent(
              uploadData.image_url
            )}&location=${encodeURIComponent(
              location.trim()
            )}`,
            {
              method: "POST",
            }
          );

        if (!analyzeResponse.ok) {
          throw new Error(
            "AI analysis failed"
          );
        }

        const analyzeData =
          await analyzeResponse.json();

        console.log(
          "AI analysis:",
          analyzeData
        );

        // ======================================
        // STEP 3: Show AI result
        // ======================================

        setAiResult(
  analyzeData.analysis
);

// ======================================
// STEP 3: Calculate priority
// ======================================

const priorityResponse =
  await fetch(
    `${API_URL}/priority-score?severity=${encodeURIComponent(
      analyzeData.analysis.severity
    )}&category=${encodeURIComponent(
      analyzeData.analysis.category
    )}&location=${encodeURIComponent(
      location.trim()
    )}`
  );

if (!priorityResponse.ok) {
  throw new Error(
    "Priority calculation failed"
  );
}

const priorityData =
  await priorityResponse.json();

console.log(
  "Priority intelligence:",
  priorityData
);

if (
  priorityData.status !==
  "success"
) {
  throw new Error(
    "Priority calculation failed"
  );
}

setPriorityResult(
  priorityData
);

// ======================================
// STEP 4: Check duplicate issue
// ======================================

const duplicateResponse =
  await fetch(
    `${API_URL}/check-duplicate?category=${encodeURIComponent(
      analyzeData.analysis.category
    )}&location=${encodeURIComponent(
      location.trim()
    )}&title=${encodeURIComponent(
      analyzeData.analysis.issue
    )}`
  );

if (!duplicateResponse.ok) {
  throw new Error(
    "Duplicate check failed"
  );
}

const duplicateData =
  await duplicateResponse.json();

console.log(
  "Duplicate intelligence:",
  duplicateData
);

if (
  duplicateData.status !==
  "success"
) {
  throw new Error(
    "Duplicate check failed"
  );
}

setUploadMessage(
  duplicateData.duplicate
    ? "Photo analyzed. Similar issue detected."
    : "Photo analyzed. No similar issue found."
);


  



  

        
          
        

        // ======================================
        // STEP 4: Refresh issues
        // ======================================

        await fetchIssues();
      } catch (error) {
        console.error(
          "CivicAlert AI error:",
          error
        );

        setUploadMessage(
          "Unable to analyze photo. Please try again."
        );
      } finally {
        setUploading(false);
      }
    };

  // ==========================================
  // UPDATE ISSUE STATUS
  // ==========================================

  const handleStatusChange =
    async (
      issueId,
      newStatus
    ) => {
      try {
        const response =
          await fetch(
            `${API_URL}/issues/${issueId}/status?status=${encodeURIComponent(
              newStatus
            )}`,
            {
              method: "PATCH",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to update issue status"
          );
        }

        const data =
          await response.json();

        console.log(
          "Status updated:",
          data
        );

        await fetchIssues();
      } catch (error) {
        console.error(
          "Status update error:",
          error
        );

        alert(
          "Unable to update issue status. Please try again."
        );
      }
    };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="app">

      {/* ======================================
          TOP BAR
      ====================================== */}

      <header className="topbar">

        <div className="brand">

          <AlertTriangle
            size={28}
          />

          <span>
            CivicAlert AI
          </span>

        </div>

        <div className="topbar-subtitle">
          Community Issue Intelligence
        </div>

      </header>

      <div className="layout">

        {/* ====================================
            SIDEBAR
        ==================================== */}

        <aside className="sidebar">

          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage(
                "dashboard"
              )
            }
          >

            <LayoutDashboard
              size={20}
            />

            Dashboard

          </button>

          <button
            className={
              activePage === "report"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage(
                "report"
              )
            }
          >

            <PlusCircle
              size={20}
            />

            Report Issue

          </button>

          <button
            className={
              activePage === "issues"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage(
                "issues"
              )
            }
          >

            <FileText
              size={20}
            />

            Issues

          </button>

        </aside>

        {/* ====================================
            MAIN CONTENT
        ==================================== */}

        <main className="main-content">

          {/* ==================================
              DASHBOARD
          ================================== */}

          {activePage ===
            "dashboard" && (
            <>

              <div className="page-header">

                <div>

                  <h1>
                    Community Dashboard
                  </h1>

                  <p>
                    Monitor and understand local
                    community issues.
                  </p>

                </div>

              </div>

              {/* =================================
                  MAIN STATISTICS
              ================================= */}

              <div className="stats-grid">

                <div className="stat-card">

                  <span>
                    Total Issues
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : totalIssues}
                  </strong>

                </div>

                <div className="stat-card">

                  <span>
                    High Severity
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : highSeverityIssues}
                  </strong>

                </div>

                <div className="stat-card">

                  <span>
                    Pending
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : pendingIssues}
                  </strong>

                </div>

                <div className="stat-card">

                  <span>
                    Locations
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : uniqueLocations}
                  </strong>

                </div>

              </div>

              {/* =================================
                  CATEGORY ANALYTICS
              ================================= */}

              <section
                className="content-card"
                style={{
                  marginTop:
                    "24px",
                }}
              >

                <div className="card-header">

                  <div>

                    <h2>
                      Issue Categories
                    </h2>

                    <p>
                      Distribution of reported
                      community issues
                    </p>

                  </div>

                </div>

                <div
                  style={{
                    marginTop:
                      "20px",
                    display:
                      "grid",
                    gap:
                      "18px",
                  }}
                >

                  {Object.entries(
                    categoryCounts
                  ).map(
                    ([
                      category,
                      count,
                    ]) => {

                      const percentage =
                        totalIssues >
                        0
                          ? Math.round(
                              (count /
                                totalIssues) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={
                            category
                          }
                        >

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                              marginBottom:
                                "8px",
                            }}
                          >

                            <span
                              style={{
                                color:
                                  "#cbd5e1",
                                fontWeight:
                                  "600",
                                textTransform:
                                  "capitalize",
                              }}
                            >
                              {
                                category
                              }
                            </span>

                            <span
                              style={{
                                color:
                                  "#94a3b8",
                                fontSize:
                                  "14px",
                              }}
                            >

                              {
                                count
                              }{" "}
                              issue
                              {count !==
                              1
                                ? "s"
                                : ""}{" "}
                              ·{" "}
                              {
                                percentage
                              }
                              %

                            </span>

                          </div>

                          <div
                            style={{
                              width:
                                "100%",
                              height:
                                "10px",
                              borderRadius:
                                "999px",
                              background:
                                "#1e293b",
                              overflow:
                                "hidden",
                            }}
                          >

                            <div
                              style={{
                                width: `${percentage}%`,
                                height:
                                  "100%",
                                borderRadius:
                                  "999px",
                                background:
                                  "linear-gradient(90deg, #2563eb, #06b6d4)",
                                transition:
                                  "width 0.5s ease",
                              }}
                            />

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </section>

              {/* =================================
                  RECENT ISSUES
              ================================= */}

              <section className="content-card">

                <div className="card-header">

                  <div>

                    <h2>
                      Recent Community Issues
                    </h2>

                    <p>
                      Latest reported problems
                    </p>

                  </div>

                  <MapPin
                    size={22}
                  />

                </div>

                {loading && (
                  <p>
                    Loading community issues...
                  </p>
                )}

                {!loading &&
                  error && (
                    <p>
                      {error}
                    </p>
                  )}

                {!loading &&
                  !error &&
                  !latestIssue && (
                    <p>
                      No community issues reported yet.
                    </p>
                  )}

                {!loading &&
                  !error &&
                  latestIssue && (

                    <div className="issue-row">

                      <div>

                        <h3>
                          {
                            latestIssue.title
                          }
                        </h3>

                        <p>
                          {latestIssue.location ||
                            "Location not provided"}
                        </p>

                      </div>

                      <span
                        className={`severity ${
                          latestIssue.severity?.toLowerCase() ||
                          ""
                        }`}
                      >
                        {
                          latestIssue.severity ||
                          "Unknown"
                        }
                      </span>

                    </div>

                  )}

              </section>

            </>
          )}

          {/* ==================================
              REPORT ISSUE
          ================================== */}

          {activePage ===
            "report" && (

            <section className="content-card">

              <h1>
                Report an Issue
              </h1>

              <p>
                Submit a community problem for
                AI-powered analysis.
              </p>

              <form
                onSubmit={
                  handlePhotoUpload
                }
                style={{
                  marginTop:
                    "24px",
                  display:
                    "grid",
                  gap:
                    "18px",
                }}
              >

                {/* PHOTO */}

                <div>

                  <label>
                    Issue Photo
                  </label>

                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    required
                    onChange={(
                      event
                    ) => {

                      setSelectedFile(
                        event.target
                          .files[0]
                      );

                      setUploadMessage(
                        ""
                      );

                      setAiResult(
                        null
                      );

                      setComplaint(
                        null
                      );

                      setComplaintMessage(
                        ""
                      );

                    }}
                    style={{
                      width:
                        "100%",
                      marginTop:
                        "8px",
                      padding:
                        "12px",
                      borderRadius:
                        "8px",
                      border:
                        "1px solid #334155",
                      background:
                        "#0f172a",
                      color:
                        "#cbd5e1",
                    }}
                  />

                </div>

                {selectedFile && (

                  <p
                    style={{
                      color:
                        "#94a3b8",
                      fontSize:
                        "14px",
                    }}
                  >

                    Selected:{" "}
                    {
                      selectedFile.name
                    }

                  </p>

                )}

                {/* LOCATION */}

                <div>

                  <label>
                    Issue Location
                  </label>

                  <div
                    style={{
                      position:
                        "relative",
                      marginTop:
                        "8px",
                    }}
                  >

                    <MapPin
                      size={18}
                      style={{
                        position:
                          "absolute",
                        left:
                          "12px",
                        top:
                          "50%",
                        transform:
                          "translateY(-50%)",
                        color:
                          "#60a5fa",
                      }}
                    />

                    <input
                      type="text"
                      name="location"
                      value={
                        location
                      }
                      onChange={(
                        event
                      ) => {

                        setLocation(
                          event.target
                            .value
                        );

                        setUploadMessage(
                          ""
                        );

                      }}
                      placeholder="Example: Main Road, Sahibganj"
                      required
                      style={{
                        width:
                          "100%",
                        padding:
                          "12px 12px 12px 40px",
                        borderRadius:
                          "8px",
                        border:
                          "1px solid #334155",
                        background:
                          "#0f172a",
                        color:
                          "#f8fafc",
                      }}
                    />

                  </div>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    uploading
                  }
                  style={{
                    padding:
                      "13px 20px",
                    border:
                      "none",
                    borderRadius:
                      "9px",
                    background:
                      "linear-gradient(135deg, #2563eb, #06b6d4)",
                    color:
                      "#ffffff",
                    fontWeight:
                      "600",
                    cursor:
                      uploading
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      uploading
                        ? 0.7
                        : 1,
                  }}
                >

                  {uploading
                    ? "AI Analyzing..."
                    : "Upload & Analyze"}

                </button>

                {/* MESSAGE */}

                {uploadMessage && (

                  <p
                    style={{
                      color:
                        "#67e8f9",
                      fontSize:
                        "14px",
                    }}
                  >
                    {
                      uploadMessage
                    }
                  </p>

                )}

                {/* ==================================
                    AI RESULT
                ================================== */}

                {aiResult && (

                  <div
                    style={{
                      marginTop:
                        "10px",
                      padding:
                        "20px",
                      borderRadius:
                        "14px",
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
                        fontSize:
                          "20px",
                        marginBottom:
                          "18px",
                        color:
                          "#f8fafc",
                      }}
                    >
                      AI Analysis
                    </h2>

                    <div
                      style={{
                        display:
                          "grid",
                        gap:
                          "12px",
                      }}
                    >

                      <p
                        style={{
                          color:
                            "#cbd5e1",
                          lineHeight:
                            "1.6",
                        }}
                      >

                        <strong
                          style={{
                            color:
                              "#f8fafc",
                          }}
                        >
                          Issue:
                        </strong>{" "}

                        {
                          aiResult.issue
                        }

                      </p>

                      <p
                        style={{
                          color:
                            "#cbd5e1",
                          lineHeight:
                            "1.6",
                        }}
                      >

                        <strong
                          style={{
                            color:
                              "#f8fafc",
                          }}
                        >
                          Category:
                        </strong>{" "}

                        {
                          aiResult.category
                        }

                      </p>

                      <p
                        style={{
                          color:
                            "#cbd5e1",
                          lineHeight:
                            "1.6",
                        }}
                      >

                        <strong
                          style={{
                            color:
                              "#f8fafc",
                          }}
                        >
                          Severity:
                        </strong>{" "}

                        <span
                          className={`severity ${
                            aiResult.severity?.toLowerCase() ||
                            ""
                          }`}
                        >
                          {
                            aiResult.severity
                          }
                        </span>

                      </p>

                      <p
                        style={{
                          color:
                            "#cbd5e1",
                          lineHeight:
                            "1.7",
                        }}
                      >

                        <strong
                          style={{
                            color:
                              "#f8fafc",
                          }}
                        >
                          Location:
                        </strong>{" "}

                        {
                          location
                        }

                      </p>

                      <p
                        style={{
                          color:
                            "#cbd5e1",
                          lineHeight:
                            "1.7",
                        }}
                      >

                        <strong
                          style={{
                            color:
                              "#f8fafc",
                          }}
                        >
                          Explanation:
                        </strong>{" "}

                        {
                          aiResult.explanation
                        }

                      </p>

                    </div>

                  </div>

                )}
                {/* ==================================
    AI PRIORITY INTELLIGENCE
================================== */}

{priorityResult && (
  <div
    style={{
      marginTop: "16px",
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
        marginBottom: "16px",
        color: "#f8fafc",
      }}
    >
      AI Priority Intelligence
    </h2>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "14px",
            marginBottom: "6px",
          }}
        >
          Priority Score
        </p>

        <strong
          style={{
            fontSize: "36px",
            color: "#f8fafc",
          }}
        >
          {priorityResult.priority_score}

          <span
            style={{
              fontSize: "18px",
              color: "#64748b",
            }}
          >
            /100
          </span>
        </strong>
      </div>

      <span
        style={{
          padding: "8px 16px",
          borderRadius: "999px",
          background:
            priorityResult.priority === "high"
              ? "rgba(239, 68, 68, 0.15)"
              : priorityResult.priority === "medium"
              ? "rgba(234, 179, 8, 0.15)"
              : "rgba(34, 197, 94, 0.15)",
          color:
            priorityResult.priority === "high"
              ? "#fca5a5"
              : priorityResult.priority === "medium"
              ? "#fde68a"
              : "#86efac",
          fontWeight: "700",
          textTransform: "uppercase",
        }}
      >
        {priorityResult.priority} Priority
      </span>
    </div>

    <p
      style={{
        marginTop: "16px",
        color: "#cbd5e1",
        lineHeight: "1.7",
      }}
    >
      <strong
        style={{
          color: "#f8fafc",
        }}
      >
        Reason:
      </strong>{" "}
      {priorityResult.reason}
    </p>
  </div>
)}

                {/* ==================================
                    GENERATE COMPLAINT BUTTON
                ================================== */}

                {aiResult && (

                  <button
                    type="button"
                    onClick={
                      handleGenerateComplaint
                    }
                    disabled={
                      generatingComplaint
                    }
                    style={{
                      width:
                        "100%",
                      marginTop:
                        "4px",
                      padding:
                        "14px 20px",
                      border:
                        "none",
                      borderRadius:
                        "10px",
                      background:
                        "linear-gradient(90deg, #2563eb, #06b6d4)",
                      color:
                        "#ffffff",
                      fontSize:
                        "16px",
                      fontWeight:
                        "700",
                      cursor:
                        generatingComplaint
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        generatingComplaint
                          ? 0.7
                          : 1,
                    }}
                  >

                    {generatingComplaint
                      ? "Generating Complaint..."
                      : "Generate Complaint"}

                  </button>

                )}

                {/* ==================================
                    COMPLAINT MESSAGE
                ================================== */}

                {complaintMessage && (

                  <p
                    style={{
                      color:
                        "#67e8f9",
                      fontSize:
                        "14px",
                    }}
                  >
                    {
                      complaintMessage
                    }
                  </p>

                )}

                {/* ==================================
                    GENERATED COMPLAINT
                ================================== */}

                {complaint && (

                  <div
                    style={{
                      marginTop:
                        "2px",
                      padding:
                        "20px",
                      borderRadius:
                        "14px",
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
                        fontSize:
                          "20px",
                        marginBottom:
                          "18px",
                        color:
                          "#f8fafc",
                      }}
                    >
                      Generated Civic Complaint
                    </h2>

                    <p
                      style={{
                        color:
                          "#94a3b8",
                        fontSize:
                          "14px",
                        marginBottom:
                          "8px",
                      }}
                    >
                      Subject
                    </p>

                    <h3
                      style={{
                        color:
                          "#f8fafc",
                        marginBottom:
                          "20px",
                      }}
                    >
                      {
                        complaint.subject
                      }
                    </h3>

                    <p
                      style={{
                        color:
                          "#cbd5e1",
                        lineHeight:
                          "1.7",
                      }}
                    >
                      {
                        complaint.complaint
                      }
                    </p>

                  </div>

                )}

              </form>

            </section>

          )}

          {/* ==================================
              ISSUES PAGE
          ================================== */}

          {activePage ===
            "issues" && (

            <section className="content-card">

              <h1>
                Community Issues
              </h1>

              <p>
                View reported issues and manage
                their current status.
              </p>

              {/* SEARCH + FILTERS */}

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "12px",
                  flexWrap:
                    "wrap",
                  marginTop:
                    "20px",
                  marginBottom:
                    "20px",
                }}
              >

                <input
                  type="text"
                  placeholder="Search issues..."
                  value={
                    searchTerm
                  }
                  onChange={(
                    event
                  ) =>
                    setSearchTerm(
                      event.target
                        .value
                    )
                  }
                  style={{
                    flex:
                      1,
                    minWidth:
                      "220px",
                    padding:
                      "10px 12px",
                    borderRadius:
                      "8px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color:
                      "#f8fafc",
                  }}
                />

                {/* SEVERITY FILTER */}

                <select
                  value={
                    severityFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setSeverityFilter(
                      event.target
                        .value
                    )
                  }
                  style={{
                    padding:
                      "10px 12px",
                    borderRadius:
                      "8px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color:
                      "#f8fafc",
                  }}
                >

                  <option value="all">
                    All Severity
                  </option>

                  <option value="high">
                    High
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="low">
                    Low
                  </option>

                </select>

                {/* STATUS FILTER */}

                <select
                  value={
                    statusFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setStatusFilter(
                      event.target
                        .value
                    )
                  }
                  style={{
                    padding:
                      "10px 12px",
                    borderRadius:
                      "8px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color:
                      "#f8fafc",
                  }}
                >

                  <option value="all">
                    All Status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="in progress">
                    In Progress
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                </select>

              </div>

              {/* ==================================
                  ISSUE LIST
              ================================== */}

              {!loading &&
                issues.length >
                  0 && (

                  <div
                    style={{
                      marginTop:
                        "20px",
                    }}
                  >

                    {filteredIssues.map(
                      (issue) => (

                        <div
                          className="issue-row"
                          key={
                            issue.id
                          }
                          style={{
                            marginBottom:
                              "12px",
                            alignItems:
                              "flex-start",
                          }}
                        >

                          <div
                            style={{
                              flex:
                                1,
                            }}
                          >

                            <h3>
                              {
                                issue.title
                              }
                            </h3>

                            <p>
                              {
                                issue.location ||
                                "Location not provided"
                              }
                            </p>

                            {issue.category && (

                              <p
                                style={{
                                  marginTop:
                                    "5px",
                                }}
                              >
                                Category:{" "}
                                {
                                  issue.category
                                }
                              </p>

                            )}

                            <p
                              style={{
                                marginTop:
                                  "5px",
                              }}
                            >

                              Status:{" "}

                              <strong>
                                {
                                  issue.status ||
                                  "pending"
                                }
                              </strong>

                            </p>

                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              alignItems:
                                "flex-end",
                              gap:
                                "10px",
                            }}
                          >

                            {/* SEVERITY */}

                            <span
                              className={`severity ${
                                issue.severity?.toLowerCase() ||
                                ""
                              }`}
                            >
                              {
                                issue.severity ||
                                "Unknown"
                              }
                            </span>

                            {/* STATUS UPDATE */}

                            <select
                              value={
                                issue.status ||
                                "pending"
                              }
                              onChange={(
                                event
                              ) =>
                                handleStatusChange(
                                  issue.id,
                                  event
                                    .target
                                    .value
                                )
                              }
                              style={{
                                padding:
                                  "8px 10px",
                                borderRadius:
                                  "8px",
                                border:
                                  "1px solid #334155",
                                background:
                                  "#0f172a",
                                color:
                                  "#f8fafc",
                                cursor:
                                  "pointer",
                              }}
                            >

                              <option value="pending">
                                Pending
                              </option>

                              <option value="in progress">
                                In Progress
                              </option>

                              <option value="resolved">
                                Resolved
                              </option>

                            </select>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              {/* NO ISSUES */}

              {!loading &&
                issues.length ===
                  0 && (

                  <p
                    style={{
                      marginTop:
                        "20px",
                    }}
                  >
                    No issues found.
                  </p>

                )}

              {/* NO FILTER RESULTS */}

              {!loading &&
                issues.length >
                  0 &&
                filteredIssues.length ===
                  0 && (

                  <p
                    style={{
                      marginTop:
                        "20px",
                    }}
                  >
                    No issues match the selected
                    search or filters.
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
