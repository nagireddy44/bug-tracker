const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let bugs = [];
let nextId = 1;

app.get("/", (req, res) => {
    res.send("Bug Tracker API is running!");
});

app.get("/api/bugs", (req, res) => {
    res.json(bugs);
});

app.post("/api/bugs", (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            message: "Title and description are required"
        });
    }

    const bug = {
        id: nextId++,
        title,
        description,
        status: "Open"
    };

    bugs.push(bug);
    res.status(201).json(bug);
});

app.patch("/api/bugs/:id", (req, res) => {
    const bug = bugs.find(b => b.id === Number(req.params.id));

    if (!bug) {
        return res.status(404).json({ message: "Bug not found" });
    }

    const { status } = req.body;
    const allowedStatuses = ["Open", "In Progress", "Fixed"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    bug.status = status;
    res.json(bug);
});

app.delete("/api/bugs/:id", (req, res) => {
    const bugIndex = bugs.findIndex(
        b => b.id === Number(req.params.id)
    );

    if (bugIndex === -1) {
        return res.status(404).json({
            message: "Bug not found"
        });
    }

    bugs.splice(bugIndex, 1);

    res.json({ message: "Bug deleted successfully" });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});