const express = require("express");
const Route = express.Router();

const auth = require("../controllers/auth");

Route.post("/register", auth.register);
Route.post("/login", auth.login);
Route.put("/update", auth.update);

module.exports = Route;
