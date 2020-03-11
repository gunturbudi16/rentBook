const express = require("express");
const Route = express.Router();
const rentBook = require("../controllers/rentBook");

Route.put("/:id", rentBook.editRentBook);
//Route.put("/editPhoto/:id", rentBook.editRentBookPhoto);
Route.get("/:id", rentBook.getRentBookById);

module.exports = Route;
