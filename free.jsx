server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// 1. Create schema and collection
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, unique: true, trim: true },
    department: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 8 }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

// 2. Insert one student
app.post("/api/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000
        ? "Roll number already exists"
        : error.message
    });
  }
});

// 3. Insert multiple students
app.post("/api/students/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: "Provide an array of students" });
    }

    const students = await Student.insertMany(req.body, { ordered: false });
    res.status(201).json(students);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. Display and search students
app.get("/api/students", async (req, res) => {
  try {
    const filter = {};

    if (req.query.department) {
      filter.department = req.query.department;
    }

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    const students = await Student.find(filter).sort({ name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Find one student
app.get("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. Update a student
app.put("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.message
    });
  }
});

// 7. Update multiple students
app.patch("/api/students", async (req, res) => {
  try {
    const { department, semester } = req.body;

    if (!department || !Number.isInteger(semester)) {
      return res.status(400).json({
        message: "Provide department and integer semester"
      });
    }

    const result = await Student.updateMany(
      { department },
      { $set: { semester } },
      { runValidators: true }
    );

    res.json({
      message: "Matching students updated",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 8. Delete one student
app.delete("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 9. Delete multiple students by department
app.delete("/api/students", async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({
        message: "Provide a department to delete"
      });
    }

    const result = await Student.deleteMany({ department });

    res.json({
      message: "Matching students deleted",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 10. Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`Server running on ${port}`));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
44444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444

App.jsx

import { useCallback, useEffect, useState } from "react";
import "./App.css";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/students`;

const emptyForm = {
  name: "",
  rollNo: "",
  department: "",
  semester: "5"
};

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  };

  const loadStudents = useCallback(async () => {
    try {
      const query = search.trim()
        ? `?name=${encodeURIComponent(search.trim())}`
        : "";

      setStudents(await request(`${API}${query}`));
    } catch (error) {
      setMessage(error.message);
    }
  }, [search]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        rollNo: form.rollNo.trim(),
        department: form.department.trim(),
        semester: Number(form.semester)
      };

      if (
        !payload.name ||
        !payload.rollNo ||
        !payload.department ||
        !Number.isInteger(payload.semester) ||
        payload.semester < 1 ||
        payload.semester > 8
      ) {
        throw new Error("Enter valid details and semester (1–8).");
      }

      if (editingId) {
        await request(`${API}/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setMessage("Student updated successfully");
      } else {
        await request(API, {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setMessage("Student added successfully");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function editStudent(student) {
    setEditingId(student._id);
    setForm({
      name: student.name,
      rollNo: student.rollNo,
      department: student.department,
      semester: String(student.semester)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStudent(id) {
    if (!window.confirm("Delete this student?")) return;

    try {
      await request(`${API}/${id}`, { method: "DELETE" });
      setMessage("Student deleted successfully");
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function insertSampleRecords() {
    const samples = [
      {
        name: "Arun",
        rollNo: "DEMO101",
        department: "CSE",
        semester: 5
      },
      {
        name: "Priya",
        rollNo: "DEMO102",
        department: "IT",
        semester: 5
      }
    ];

    try {
      await request(`${API}/bulk`, {
        method: "POST",
        body: JSON.stringify(samples)
      });
      setMessage("Sample records inserted");
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateDepartment() {
    const department = window.prompt("Department to update (e.g. CSE)");
    if (!department) return;

    const semesterText = window.prompt("New semester (1–8)");
    if (semesterText === null || semesterText.trim() === "") return;

    const semester = Number(semesterText);

    if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
      setMessage("Enter a semester from 1 to 8");
      return;
    }

    try {
      const data = await request(API, {
        method: "PATCH",
        body: JSON.stringify({ department, semester })
      });
      setMessage(`Updated ${data.modifiedCount} record(s)`);
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteDepartment() {
    const department = window.prompt("Department to delete");
    if (!department) return;

    if (!window.confirm(`Delete all ${department} students?`)) return;

    try {
      const data = await request(API, {
        method: "DELETE",
        body: JSON.stringify({ department })
      });
      setMessage(`Deleted ${data.deletedCount} record(s)`);
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Student Management</h1>
        <p>MERN Stack · MongoDB CRUD Operations</p>
      </header>

      <section className="panel">
        <h2>{editingId ? "Update Student" : "Add Student"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Student name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="rollNo"
            placeholder="Roll number"
            value={form.rollNo}
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <input
            name="semester"
            type="number"
            min="1"
            max="8"
            placeholder="Semester"
            value={form.semester}
            onChange={handleChange}
            required
          />

          <button disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
                ? "Update Student"
                : "Add Student"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="panel">
        <h2>Student Records ({students.length})</h2>

        <div className="toolbar">
          <input
            placeholder="Search by student name"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="button" onClick={loadStudents}>
            Search
          </button>
        </div>

        <div className="actions">
          <button type="button" onClick={insertSampleRecords}>
            Insert Sample Records
          </button>
          <button type="button" onClick={updateDepartment}>
            Update Department
          </button>
          <button type="button" className="danger" onClick={deleteDepartment}>
            Delete Department
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.department}</td>
                  <td>{student.semester}</td>
                  <td className="row-actions">
                    <button onClick={() => editStudent(student)}>
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => deleteStudent(student._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan="5">No student records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

App.css

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f1f5f9;
  color: #0f172a;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

header {
  text-align: center;
  margin-bottom: 28px;
}

header h1 {
  color: #0369a1;
  margin-bottom: 8px;
}

header p {
  color: #64748b;
}

.panel {
  background: white;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 3px 12px #0000000d;
}

.panel h2 {
  margin-top: 0;
}

form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

input {
  width: 100%;
  min-width: 0;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  font-size: 15px;
}

input:focus {
  outline: 2px solid #38bdf8;
  border-color: #0284c7;
}

button {
  padding: 11px 15px;
  background: #0284c7;
  color: white;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 600;
}

button:hover {
  background: #0369a1;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary {
  background: #64748b;
}

.danger {
  background: #dc2626;
}

.danger:hover {
  background: #b91c1c;
}

.message {
  margin-bottom: 0;
  color: #0369a1;
  overflow-wrap: anywhere;
}

.toolbar,
.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.toolbar input {
  flex: 1;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

th {
  background: #e0f2fe;
}

.row-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 600px) {
  .container {
    padding: 12px;
  }

  .panel {
    padding: 16px;
  }

  form {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
  }
}
