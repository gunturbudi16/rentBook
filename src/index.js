const express = require("express");
const Route = express.Router();

const auth = require("./routes/auth");
const rentBook = require("./routes/rentBook");
Route.use("/auth", auth).use("/rentBook", rentBook);

module.exports = Route;
