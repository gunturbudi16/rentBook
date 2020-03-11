const express = require("express");
const Route = express.Router();
const rentBook = require("../controllers/rentBook");

Route.put("/:id", rentBook.editRentBook)
  .put("/editPhoto/:id", rentBook.editRentBookPhoto)
  .get("/:id", rentBook.getRentBookById);

module.exports = Route;
