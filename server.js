// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const requestId = require("./middleware/requestId");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(requestId);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/records", require("./routes/recordRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.use(errorHandler);

// Keeps the server awake by responding to periodic pings to prevent sleep mode.
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
