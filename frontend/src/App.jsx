import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [bugs, setBugs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const API = "http://localhost:5000/api/bugs";

  const fetchBugs = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setBugs(data);
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const addBug = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    fetchBugs();
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchBugs();
  };

  const deleteBug = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchBugs();
  };

  return (
    <div className="container">
      <h1>Bug Tracker</h1>
      <p>Report and track software issues</p>

      <form onSubmit={addBug}>
        <input
          placeholder="Bug title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Describe the bug"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Report Bug</button>
      </form>

      <h2>Reported Bugs ({bugs.length})</h2>

      {bugs.map((bug) => (
        <div className="bug-card" key={bug.id}>
          <h3>{bug.title}</h3>
          <p>{bug.description}</p>

          <select
            value={bug.status}
            onChange={(e) => updateStatus(bug.id, e.target.value)}
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Fixed</option>
          </select>

          <button onClick={() => deleteBug(bug.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;