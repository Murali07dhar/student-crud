const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ---------- Connect to the EXISTING database "2024025876" ----------
// If you get ECONNREFUSED ::1:27017, use 127.0.0.1 instead of localhost
mongoose
  .connect("mongodb://localhost:27017/2024025876")
  .then(() => console.log("Connected to MongoDB (database: 2024025876)"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// ---------- Model mapped to the EXISTING collection "students" ----------
const studentSchema = new mongoose.Schema(
  {
    student_id: { type: Number, required: true },
    name: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    cgpa: { type: Number, required: true },
  },
  {
    versionKey: false, // don't add __v to your documents
    autoIndex: false, // don't create any indexes on your collection
  }
);

// 3rd argument "students" forces Mongoose to use that exact collection name
const Student = mongoose.model("Student", studentSchema, "students");

const pickFields = (body) => ({
  student_id: Number(body.student_id),
  name: body.name,
  branch: body.branch,
  year: Number(body.year),
  cgpa: Number(body.cgpa),
});

// ---------- READ ----------
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ student_id: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- CREATE ----------
app.post("/api/students", async (req, res) => {
  try {
    const data = pickFields(req.body);
    const exists = await Student.findOne({ student_id: data.student_id });
    if (exists) {
      return res
        .status(400)
        .json({ message: `Student ID ${data.student_id} already exists` });
    }
    const student = await Student.create(data);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- UPDATE ----------
app.put("/api/students/:id", async (req, res) => {
  try {
    const data = pickFields(req.body);
    const clash = await Student.findOne({
      student_id: data.student_id,
      _id: { $ne: req.params.id },
    });
    if (clash) {
      return res
        .status(400)
        .json({ message: `Student ID ${data.student_id} already exists` });
    }
    const updated = await Student.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- DELETE ----------
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
