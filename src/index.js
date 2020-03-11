const express = require("express");
const Route = express.Router();

const auth = require("./routes/auth");
const rentBook = require("./routes/rentBook");
const admin = require("./routes/admin");
Route.use("/auth", auth);
Route.use("/rentBook", rentBook);
Route.use("/admin", admin);

module.exports = Route;
