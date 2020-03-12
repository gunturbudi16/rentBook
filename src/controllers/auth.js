const multer = require("multer");
const authModel = require("../models/auth");
const JWT = require("jsonwebtoken");
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const misc = require("../helpers/respons");

require("dotenv").config();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/users");
  },
  filename: (req, file, cb) => {
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, file.fieldname + "-" + Date.now() + "." + filetype);
  }
});

// init upload multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 6 * 1024 * 1024
  }
}).single("photo");

module.exports = {
  register: (req, res) => {
    upload(req, res, _err => {
      const { email, name } = req.body;
      const salt = bcrypt.genSaltSync(saltRounds);
      const password = bcrypt.hashSync(req.body.password, salt);
      const photo = req.file ? req.file.filename : null;
      const data = { email, name, password, photo };
      const checkEmail = emailRegex.test(email);

      if (checkEmail === true) {
        authModel
          .register(data)
          .then(result => {
            res
              .status(200)
              .json({
                status: 200,
                error: false,
                user: { email, name, password, photo },
                detail: result,
                message: "Successfull Register New User"
              })

              .catch(err => {
                console.log(err);
                res.status(400).json({
                  status: 400,
                  error: true,
                  message: "Error",
                  detail: err
                });
              });
          })
          .catch(err => {
            res.status(400).json({
              status: 400,
              error: true,
              message: "Email is already registered",
              detail: err
            });
          });
      } else {
        res.status(400).json({
          status: 400,
          error: true,
          message: "Email not Valid"
        });
      }
    });
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await authModel.getEmail(email);

      if (user.length === 0) {
        return response
          .status(400)
          .json({ errors: [{ msg: "User not found in our database" }] });
      }

      const isMatch = await bcrypt.compare(password, user[0].password);

      if (!isMatch) {
        return response
          .status(400)
          .json({ errors: [{ msg: "Password do not match" }] });
      }

      const payload = {
        user: {
          id: user[0].id,
          email: user[0].email
        }
      };

      const token = await jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: 360000
      });

      const data = {
        token,
        id: user[0].id,
        email: user[0].email
      };

      misc.response(res, 200, false, "Successfull login", data);
    } catch (error) {
      console.error(error.message);
      misc.response(res, 500, true, "Server error");
    }
  }
};
