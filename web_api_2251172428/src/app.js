require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    data: { status: "OK" },
  });
});

app.use("/api", routes);
app.use((req, res) => {
  return res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

module.exports = app;
