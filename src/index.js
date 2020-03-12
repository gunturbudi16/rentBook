const express = require("express");
const Route = express.Router();

const auth = require("./routes/auth");
Route.use("/auth", auth);

module.exports = Route;
