const express = require("express");
const Route = express.Router();
const admin = require("../controllers/admin");
//const checkCache = require('../configs/cache')

Route
  //.get('/', checkCache, admin.getAdmin)
  .get("/:id", admin.getAdminById)
  .post("/", admin.createAdmin)
  .patch("/:id", admin.updateAdmin)
  .delete("/:id", admin.deleteAdmin);

module.exports = Route;
