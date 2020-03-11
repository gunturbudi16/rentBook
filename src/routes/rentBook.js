const express = require("express");
const Route = express.Router();
const multer = require("multer");
const rentBook = require("../controllers/rentBook");
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "./public/images/customer");
  },
  filename: (request, file, callback) => {
    callback(null, file.originalname);
  }
});

const upload = multer({
  storage
});
Route.put("/:id", rentBook.editRentBook)
  .put("/editPhoto/:id", upload.single("photo"), rentBook.editRentBookPhoto)
  .get("/:id", rentBook.getRentBookById);

module.exports = Route;
