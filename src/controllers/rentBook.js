const customersModel = require("../models/rentBook");
const multer = require("multer");
//const fs = require("fs-extra");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/images/customer");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

module.exports = {
  editRentBook: (req, res) => {
    const id = req.params.id;
    const { name, phone, address } = req.body;
    customersModel
      .editRentBook(id, name, phone, address)
      .then(result => {
        res.status(200).json({
          id,
          name,
          phone,
          address,
          message: "Successfuly Edit a Customers"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          status: 400,
          error: true,
          message: "Email or Password incorect"
        });
      });
  },
  getRentBookById: (req, res) => {
    const id = req.params.id;
    customersModel
      .getCustomerById(id)
      .then(result => {
        res.status(200).json({
          result,
          message: "Successfuly get data Customers by id"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          status: 400,
          error: true,
          message: "Error get data Customers by id"
        });
      });
  },
  editRentBookPhoto: (req, res) => {
    upload(req, res, err => {
      if (err) {
        res.status(400).json({
          message: err
        });
      } else {
        const id = req.params.id;
        const photo = req.file ? req.filename : req.file;
        const data = { id, photo };
        customersModel
          .editRentBook(data)
          .then(result => {
            res.status(200).json({
              error: false,
              message: result
            });
          })
          .catch(err => {
            res.status(400).json({
              error: true,
              message: err
            });
          });
      }
    });
  }
};
