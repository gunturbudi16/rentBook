const customersModel = require("../models/rentBook");
//const multer = require("multer");
const fs = require("fs-extra");

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/images/customer");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });

// const filter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("File format should be PNG, JPG, or JPEG"));
//   }
// };

// const upload = multer({
//   storage: fileStorage,
//   fileFilter: filter,
//   limits: { fileSize: 6000000 }
// });

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
    let error = false;
    if (request) {
      if (request.file) {
        if (request.file.size >= 5242880) {
          const message = "Ooop!, Size can't more than 5mb";
          error = true;

          fs.unlink(
            `public/images/customer/${request.file.originalname}`,
            function(error) {
              if (error)
                res.status(400).json({
                  status: 400,
                  error: true,
                  message: message
                });
            }
          );
          const file = request.file.originalname;
          const extension = file.split(".");
          const filename = extension[extension.length - 1];
          if (!isImage(filename)) {
            error = true;
            fs.unlink(
              `public/images/customer/${request.file.originalname}`,
              function(error) {
                if (error)
                  res.status(400).json({
                    status: 400,
                    error: true,
                    message: "Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG"
                  });
              }
            );
          }
          function isImage(filename) {
            switch (filename) {
              case "jpg":
              case "jpeg":
              case "png":
              case "gif":
              case "svg":
                return true;
            }
            return false;
          }
        }
      }
      const photo = request.file.originalname;
      const id = request.params.id;
      customersModel
        .editRentBookPhoto(photo, id)
        .then(result => {
          console.log(result, "halo");
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
            message: "Error update data"
          });
        });
    }

    //   upload.single("photo"),
    //     (req, res) => {
    //       const photo = req.file.filename;
    //       const id = req.params.id;
    //       customersModel
    //         .editRentBookPhoto(photo, id)
    //         .then(result => {
    //           console.log(result, "halo");
    //           res.status(200).json({
    //             status: 200,
    //             error: false,
    //             data: result,
    //             message: "Successfully update data"
    //           });
    //         })
    //         .catch(err => {
    //           console.log(err);
    //           res.status(400).json({
    //             status: 400,
    //             error: true,
    //             message: "Error update data"
    //           });
    //         });
    //     };
    // }
  }
};
