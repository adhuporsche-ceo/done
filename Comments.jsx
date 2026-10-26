import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    event: ""
  });
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Booking successful");
      setForm({ name: "", email: "", event: "" });
    } catch (err) {
      setMessage(err.message || "Request failed");
    }
  }

  return (
    <form onSubmit={submit}>
      <input name="name" placeholder="Name" required
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input name="email" type="email" placeholder="Email" required
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />

      <select name="event" required value={form.event}
        onChange={e => setForm({ ...form, event: e.target.value })}>
        <option value="">Select event</option>
        <option>AI Workshop</option>
        <option>Web Development</option>
        <option>Cybersecurity</option>
      </select>

      <button type="submit">Book Now</button>
      <p>{message}</p>
    </form>
  );
}


5555555555555555555555555555555555555555555555555555555555555555555555555555555555
server.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  event: { type: String, required: true }
});

const Booking = mongoose.model("Booking", schema);

app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, event } = req.body;

    if (!name?.trim() || !email?.trim() || !event)
      return res.status(400).json({ message: "All fields required" });

    const booking = await Booking.create({ name, email, event });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    res.json(await Booking.find());
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 4000))
  .catch(console.error);
  4444444444444444444444444444444444444444444444444444444444444444444


Online Course Enrollment
App.jsx
import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", course: "" });
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enrollments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Enrollment successful");
    } catch (err) {
      setMessage(err.message || "Enrollment failed");
    }
  }

  return (
    <form onSubmit={submit}>
      <input placeholder="Name" required value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input type="email" placeholder="Email" required value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />

      <input placeholder="Course" required value={form.course}
        onChange={e => setForm({ ...form, course: e.target.value })} />

      <button>Enroll</button>
      <p>{message}</p>
    </form>
  );
}
5555555555555555555555555555555555555555555555555555555555555555555555
server.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  course: { type: String, required: true }
});

const Enrollment = mongoose.model("Enrollment", schema);

app.post("/api/enrollments", async (req, res) => {
  try {
    const { name, email, course } = req.body;

    if (!name?.trim() || !email?.trim() || !course?.trim())
      return res.status(400).json({ message: "All fields required" });

    const enrollment = await Enrollment.create({ name, email, course });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: "Enrollment failed" });
  }
});

app.get("/api/enrollments", async (req, res) => {
  try {
    res.json(await Enrollment.find());
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 4000))
  .catch(console.error);
  44444444444444444444444444444444444444444444444444444444444444444444444444444444444444444


  Student Mentoring Appointment
  import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    studentName: "",
    mentorName: "",
    date: "",
    time: ""
  });
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Appointment booked successfully");
    } catch (err) {
      setMessage(err.message || "Booking failed");
    }
  }

  return (
    <form onSubmit={submit}>
      {Object.keys(form).map(field => (
        <input
          key={field}
          name={field}
          placeholder={field}
          type={field === "date" ? "date" : "text"}
          required
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
        />
      ))}
      <button>Book Appointment</button>
      <p>{message}</p>
    </form>
  );
}

server.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const schema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  mentorName: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
});

const Appointment = mongoose.model("Appointment", schema);

app.post("/api/appointments", async (req, res) => {
  try {
    const { studentName, mentorName, date, time } = req.body;

    if (!studentName?.trim() || !mentorName?.trim() || !date || !time)
      return res.status(400).json({ message: "All fields required" });

    const appointment = await Appointment.create({
      studentName, mentorName, date, time
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Appointment failed" });
  }
});

app.get("/api/appointments", async (req, res) => {
  try {
    res.json(await Appointment.find());
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 4000))
  .catch(console.error);
  55555555555555555555555555555555555555555555555555555555555555555555555
  Workshop Registration
  import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    workshop: ""
  });
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/registrations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Registration successful");
    } catch (err) {
      setMessage(err.message || "Registration failed");
    }
  }

  return (
    <form onSubmit={submit}>
      {Object.keys(form).map(field => (
        <input
          key={field}
          name={field}
          placeholder={field}
          required
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
        />
      ))}
      <button>Register</button>
      <p>{message}</p>
    </form>
  );
}
44444444444444444444444444444444444444444444444444444444444444444
server.jss
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  workshop: { type: String, required: true, trim: true }
});

const Registration = mongoose.model("Registration", schema);

app.post("/api/registrations", async (req, res) => {
  try {
    const { name, email, username, workshop } = req.body;

    if (!name?.trim() || !email?.trim() ||
        !username?.trim() || !workshop?.trim()) {
      return res.status(400).json({ message: "All fields required" });
    }

    const registration = await Registration.create({
      name, email, username, workshop
    });

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

app.get("/api/registrations", async (req, res) => {
  try {
    res.json(await Registration.find());
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 4000))
  .catch(console.error);
  44444444444444444444444444444444444444444444444444444444444
  server.js
  const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  workshop: { type: String, required: true, trim: true }
});

const Registration = mongoose.model("Registration", schema);

app.post("/api/registrations", async (req, res) => {
  try {
    const { name, email, username, workshop } = req.body;

    if (!name?.trim() || !email?.trim() ||
        !username?.trim() || !workshop?.trim()) {
      return res.status(400).json({ message: "All fields required" });
    }

    const registration = await Registration.create({
      name, email, username, workshop
    });

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

app.get("/api/registrations", async (req, res) => {
  try {
    res.json(await Registration.find());
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 4000))
  .catch(console.error);