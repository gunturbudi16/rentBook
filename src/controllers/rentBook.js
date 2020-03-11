const customersModel = require("../models/rentBook");
const multer = require("multer");
const redis = require("redis");
const redisClient = redis.createClient();
//const fs = require("fs-extra");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/customer");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File format should be PNG, JPG, or JPEG"));
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: filter,
  limits: { fileSize: 6000000 }
});
module.exports = {
  editRentBook: (req, res) => {
    const id = req.params.id;
    const photo = req.file.filename;
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
      .getRentBookById(id)
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
    //console.log(req);
    //console.log(res);

    upload.single("file"),
      (req, res) => {
        const fileName = req.file.filename;
        console.log(fileName);

        const id = req.params.id;
        customersModel
          .editRentBookPhoto(fileName, id)
          .then(result => {
            res.status(200).json({
              status: 200,
              error: false,
              data: result,
              message: "Successfully update data"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(400).json({
              status: 400,
              error: true,
              message: "Error Update data"
            });
          });
      };
  }
  // editRentBookPhoto: (req, res) => {
  //   upload(req, res, _err => {
  //     const photo = req.file ? req.file.filename : null;
  //     const id = req.params.id;
  //     const data = { id, photo };
  //     customersModel
  //       .editRentBookPhoto(data)
  //       .then(result => {
  //         redisClient.flushdb();
  //         customersModel
  //           .editRentBookPhoto(photo)
  //           .then(result => {
  //             console.log(result);

  //             res
  //               .status(201)
  //               .json({ status: 201, err: false, data, message: "Succes" });
  //           })
  //           .catch(err => {
  //             console.log(err);
  //             res.status(400).json({
  //               status: 400,
  //               err: true,
  //               message: "Failed to updated photo"
  //             });
  //           });
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         res.status(400).json({
  //           status: 400,
  //           err: true,
  //           message: "Failed to updated photo"
  //         });
  //       });
  //   });
  // }
};
