import { useState, useEffect } from "react";
import "./App.css";

const API = "/api/students";
const emptyForm = { student_id: "", name: "", branch: "", year: "", cgpa: "" };

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // READ
  const loadStudents = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setStudents(data);
    } catch {
      setError("Could not load students. Is the backend running?");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setForm(emptyForm);
      setEditingId(null);
      loadStudents();
    } catch {
      setError("Could not reach the server.");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      student_id: student.student_id,
      name: student.name,
      branch: student.branch,
      year: student.year,
      cgpa: student.cgpa,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      loadStudents();
    } catch {
      setError("Could not delete the student.");
    }
  };

  return (
    <div className="container">
      <h1>University Student Management</h1>

      <form className="form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

        <input
          name="student_id"
          type="number"
          placeholder="Student ID"
          value={form.student_id}
          onChange={handleChange}
          required
        />
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="branch"
          placeholder="Branch (e.g. CSE)"
          value={form.branch}
          onChange={handleChange}
          required
        />
        <input
          name="year"
          type="number"
          min="1"
          max="4"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          required
        />
        <input
          name="cgpa"
          type="number"
          step="0.01"
          min="0"
          max="10"
          placeholder="CGPA"
          value={form.cgpa}
          onChange={handleChange}
          required
        />

        <div className="buttons">
          <button type="submit" className="btn primary">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button type="button" className="btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>

        {error && <p className="error">{error}</p>}
      </form>

      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Year</th>
            <th>CGPA</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty">
                No students found.
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s._id}>
                <td>{s.student_id}</td>
                <td>{s.name}</td>
                <td>{s.branch}</td>
                <td>{s.year}</td>
                <td>{s.cgpa}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEdit(s)}>
                    Edit
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
