const adminModel = require("../models/admin");
const multer = require("multer");
const authModel = require("../models/auth");
const conn = require("../configs/connection");
const miscHelper = require("../helpers/respons");
const redis = require("redis");
const redisClient = redis.createClient();
//const fs = require("fs-extra");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/images/admin");
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
}).single("photo");

module.exports = {
  getAdmin: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const limit = req.query.limit || 10;
    const sort = req.query.sort || "DESC";
    const sortBy = req.query.sortBy || "name";
    const offset = (page - 1) * limit;

    let totalAdmin = 0;
    let totalPage = 0;
    let prevPage = 0;
    let nextPage = 0;
    conn.query(
      `SELECT COUNT(*) as data FROM admins WHERE (name LIKE '%${search}%')`,
      (err, res) => {
        if (err) {
          return miscHelper.response(res, 400, true, "Error", err);
        }
        totalAdmin = res[0].data;
        totalPage =
          totalAdmin % limit === 0
            ? totalAdmin / limit
            : Math.floor(totalAdmin / limit + 1);
        prevPage = page === 1 ? 1 : page - 1;
        nextPage = page === totalPage ? totalPage : page + 1;
      }
    );
    adminModel
      .getAll(offset, limit, sort, sortBy, search)
      .then(result => {
        const data = {
          status: 200,
          error: false,
          source: "api",
          data: result,
          total_data: Math.ceil(totalAdmin),
          per_page: limit,
          current_page: page,
          total_page: totalPage,
          nextLink:
            process.env.BASE_URL +
            req.originalUrl.replace("page=" + page, "page=" + nextPage),
          prevLink:
            process.env.BASE_URL +
            req.originalUrl.replace("page=" + page, "page=" + prevPage),
          message: "Success getting all data"
        };
        redisClient.setex(req.originalUrl, 3600, JSON.stringify(data));
        res.status(200).json({
          status: 200,
          error: false,
          source: "api",
          data: result,
          total_data: Math.ceil(totalAdmin),
          per_page: limit,
          current_page: page,
          total_page: totalPage,
          nextLink:
            process.env.BASE_URL +
            req.originalUrl.replace("page=" + page, "page=" + nextPage),
          prevLink:
            process.env.BASE_URL +
            req.originalUrl.replace("page=" + page, "page=" + prevPage),
          message: "Success getting all data"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          status: 400,
          error: true,
          message: "Data not Found"
        });
      });
  },
  getAdminById: (req, res) => {
    const adminId = req.params.id;
    storeModel
      .getAdminById(adminId)
      .then(result => {
        redisClient.flushdb();
        res.status(200).json({
          status: 200,
          error: false,
          dataShowed: result.length,
          data: result,
          response: "Data loaded"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          status: 400,
          error: true,
          message: "Failed to get store with this ID",
          detail: err
        });
      });
  }, // create Admin
  createAdmin: (req, res) => {
    upload(req, res, _err => {
      const { id, name, phone, address } = req.body;
      const photo = req.file ? req.file.filename : null;
      const data = { id, name, photo, phone, address };

      adminModel
        .createAdmin(data)
        .then(result => {
          redisClient.flushdb();
          authModel
            .update(data.id, 1)
            .then(result => {
              res.status(201).json({
                status: 201,
                err: false,
                data,
                message: "Success creted Admin"
              });
            })
            .catch(err => {
              console.log(err);
              res.status(400).json({
                status: 400,
                err: true,
                message: "Failed to created store"
              });
            });
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({
            status: 400,
            err: true,
            message: "Failed to created store"
          });
        });
    });
  }, // update Admin
  updateAdmin: (req, res) => {
    upload(req, res, err => {
      const { name, phone, address } = req.body;
      const id = req.params.id;
      const photo = req.file ? req.file.filename : null;
      const data = { id, name, photo, phone, address };
      if (photo === null) {
        delete data.photo;
      }
      if (!name && !phone && !address) {
        delete data.address;
        delete data.name;
        delete data.phone;
      }

      adminModel
        .updateAdmin(id, data)
        .then(result => {
          redisClient.flushdb();
          res.status(201).json({
            status: 201,
            err: false,
            data,
            message: "Success updated user"
          });
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({
            status: 400,
            err: true,
            message: "Failed to updated user"
          });
        });
    });
  },

  // delete store
  deleteAdmin: (req, res) => {
    const id = req.params.id;
    adminModel
      .deleteAdmin(id)
      .then(result => {
        redisClient.flushdb();
        authModel
          .update(id, 0)
          .then(res_ => {
            res.status(201).json({
              status: 201,
              err: false,
              message: "Admin have been deleted"
            });
          })
          .catch(err => {
            res.status(400).json({
              status: 400,
              err: true,
              message: "Failed to deleted Admin"
            });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          status: 400,
          err: true,
          message: "Failed to updated user"
        });
      });
  }
};
