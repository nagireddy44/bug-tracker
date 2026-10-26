import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [bugs, setBugs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000/api/bugs";

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to load issues");
      }

      const data = await response.json();
      setBugs(data);
    } catch (error) {
      console.error("Could not load bugs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const addBug = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please enter both title and description.");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to report issue");
      }

      setTitle("");
      setDescription("");
      await fetchBugs();
    } catch (error) {
      alert("Could not connect to the backend. Please check the server.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(API + "/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Unable to update status");
      }

      await fetchBugs();
    } catch (error) {
      alert("Could not update the issue status.");
    }
  };

  const deleteBug = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this issue?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(API + "/" + id, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete issue");
      }

      await fetchBugs();
    } catch (error) {
      alert("Could not delete the issue.");
    }
  };

  const counts = {
    total: bugs.length,
    open: bugs.filter((bug) => bug.status === "Open").length,
    progress: bugs.filter((bug) => bug.status === "In Progress").length,
    fixed: bugs.filter((bug) => bug.status === "Fixed").length,
  };

  const filteredBugs = bugs.filter((bug) => {
    const text =
      bug.title + " " + bug.description + " " + bug.status;

    return text.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">B</div>
          <div>
            <h2>BugBase</h2>
            <span>ISSUE MANAGEMENT</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <div className="nav-item active">
          <span>▦</span> Overview
        </div>

        <div className="nav-item">
          <span>◈</span> All issues
          <span className="nav-count">{bugs.length}</span>
        </div>

        <div className="sidebar-bottom">
          <div className="avatar">HR</div>
          <div className="profile-info">
            <strong>My Workspace</strong>
            <span>Bug tracking project</span>
          </div>
          <span className="online-dot"></span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Overview
          </div>

          <div className="topbar-right">
            <span className="live-dot"></span>
            System operational
            <div className="top-avatar">H</div>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <div className="eyebrow">YOUR DEVELOPMENT WORKSPACE</div>
            <h1>
              Bug <span>Tracker</span>
            </h1>
            <p>Track issues, manage fixes, and keep your project moving.</p>
          </div>

          <div className="date-chip">✦ Project dashboard</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card total-card">
            <div className="stat-top">
              <span>Total issues</span>
              <div className="stat-icon purple-icon">▦</div>
            </div>
            <h2>{counts.total}</h2>
            <div className="stat-foot">All reported issues</div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Open issues</span>
              <div className="stat-icon orange-icon">◷</div>
            </div>
            <h2>{counts.open}</h2>
            <div className="stat-foot">
              <span className="status-dot open-dot"></span>
              Awaiting attention
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>In progress</span>
              <div className="stat-icon blue-icon">↗</div>
            </div>
            <h2>{counts.progress}</h2>
            <div className="stat-foot">
              <span className="status-dot progress-dot"></span>
              Currently being worked on
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Resolved</span>
              <div className="stat-icon green-icon">✓</div>
            </div>
            <h2>{counts.fixed}</h2>
            <div className="stat-foot">
              <span className="status-dot fixed-dot"></span>
              Successfully fixed
            </div>
          </div>
        </section>

        <section className="workspace-grid">
          <div className="issues-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  Reported issues{" "}
                  <span className="heading-count">
                    {filteredBugs.length}
                  </span>
                </h2>
                <p>Review and manage your reported bugs.</p>
              </div>

              <div className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search issues..."
                />
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">↻</div>
                <h3>Loading issues...</h3>
              </div>
            ) : filteredBugs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◇</div>
                <h3>
                  {search ? "No matching issues" : "All clear for now"}
                </h3>
                <p>
                  {search
                    ? "Try a different search term."
                    : "Your reported bugs will appear here. Create your first issue to get started."}
                </p>
              </div>
            ) : (
              <div className="issues-list">
                {filteredBugs.map((bug) => (
                  <article className="issue-card" key={bug.id}>
                    <div className="issue-symbol">🐞</div>

                    <div className="issue-details">
                      <div className="issue-title-row">
                        <h3>{bug.title}</h3>

                        <span
                          className={
                            "badge " +
                            bug.status.toLowerCase().replace(" ", "-")
                          }
                        >
                          <span></span>
                          {bug.status}
                        </span>
                      </div>

                      <p>{bug.description}</p>

                      <div className="issue-meta">
                        ISSUE-{String(bug.id).padStart(3, "0")}
                      </div>
                    </div>

                    <div className="issue-actions">
                      <select
                        aria-label={"Update status for " + bug.title}
                        value={bug.status}
                        onChange={(e) =>
                          updateStatus(bug.id, e.target.value)
                        }
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Fixed</option>
                      </select>

                      <button
                        className="delete-button"
                        onClick={() => deleteBug(bug.id)}
                        aria-label={"Delete " + bug.title}
                        title="Delete issue"
                      >
                        ×
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="panel-footer">
              <span>
                Showing {filteredBugs.length} of {bugs.length} issues
              </span>

              <span>
                <span className="live-dot"></span>
                Live data
              </span>
            </div>
          </div>

          <aside className="report-panel">
            <div className="form-heading">
              <div className="form-icon">＋</div>
              <div>
                <h2>Report an issue</h2>
                <p>Found something that needs fixing?</p>
              </div>
            </div>

            <form onSubmit={addBug}>
              <label htmlFor="bug-title">
                Issue title <span>*</span>
              </label>

              <input
                id="bug-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Login button not working"
                maxLength={100}
                required
              />

              <label htmlFor="bug-description">
                Description <span>*</span>
              </label>

              <textarea
                id="bug-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened and how to reproduce it..."
                rows={5}
                maxLength={1000}
                required
              />

              <div className="form-hint">
                Be clear and specific so the issue is easy to understand.
              </div>

              <button className="submit-button" type="submit">
                <span>＋</span>
                Submit issue
                <span className="button-arrow">→</span>
              </button>
            </form>

            <div className="form-note">
              <span>✦</span>
              <p>
                <strong>Good reports save time.</strong>
                <br />
                Include clear details to help track each issue.
              </p>
            </div>
          </aside>
        </section>

        <footer className="page-footer">
          <span>
            BUGBASE <span className="footer-dot">●</span> ISSUE MANAGEMENT
          </span>
          <span>
            Built for better debugging{" "}
            <span className="footer-heart">♥</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;