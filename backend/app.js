const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDatabase = require("./src/config/database");
const userRoutes = require("./src/routes/userRoutes");
const companiesRoutes = require("./src/routes/companyRoutes");
const connectionRoutes = require("./src/routes/connectionRoutes");
const notificationsRoutes = require("./src/routes/notificationsRoute");
const jobRoutes = require("./src/routes/jobRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDatabase();

app.use("/api/users/", userRoutes);
app.use("/api/companies/", companiesRoutes);
app.use("/api/connections/", connectionRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
