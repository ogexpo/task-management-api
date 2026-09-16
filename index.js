require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const errorHandler = require("./middleware/errorMiddleware");


app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("Hello World");
});
const PORT = process.env.PORT || 3000;~
app.listen(3000, () => {
  console.log("Server running on port 3000");
});