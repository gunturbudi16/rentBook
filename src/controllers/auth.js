const authModel = require("../models/auth");
const customersModel = require("../models/rentBook");
const JWT = require("jsonwebtoken");
//const uuid = require("uuid");
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const bcrypt = require("bcryptjs");
const saltRounds = 10;
require("dotenv").config();

module.exports = {
  register: (req, res) => {
    const { id, email, name } = req.body;
    const is_admin = false;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(req.body.password, salt);
    const data = { id, email, password, is_admin };
    const checkEmail = emailRegex.test(email);

    if (checkEmail === true) {
      authModel
        .register(data)
        .then(result => {
          customersModel
            .createRentBooks(id, name)
            .then(result => {
              res.status(200).json({
                status: 200,
                error: false,
                user: { id, name, email, is_admin },
                detail: result,
                message: "Successfull Register New User"
              });
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
  },
  login: (req, res) => {
    const { email, password } = req.body;
    authModel
      .getPassword(email)
      .then(result => {
        const hash = result[0].password;
        const checkPass = bcrypt.compareSync(password, hash);
        if (checkPass === true) {
          authModel
            .getUser(email, hash)
            .then(result => {
              result = result[0];
              if (result) {
                const id = result.id;
                const email = result.email;
                const is_admin = result.is_admin;
                const token = JWT.sign(
                  { id, email, is_admin },
                  process.env.SECRET,
                  { expiresIn: "12h" }
                );
                res.status(201).json({
                  status: 201,
                  message: "Success Login",
                  token,
                  user: { id, email, is_admin },
                  detail: "This token only valid for 12 hour"
                });
              } else {
                res.status(400).json({
                  status: 400,
                  error: true,
                  message: "Email or Password Incorect"
                });
              }
            })
            .catch(err => {
              res.status(400).json({
                status: 400,
                error: true,
                message: "Login Failed",
                detail: err
              });
            });
        } else {
          res.status(400).json({
            status: 400,
            error: true,
            message: "Wrong Password"
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(404).json({
          status: 404,
          error: true,
          message: "Account not Found"
        });
      });
  },
  update: (id, isSeller) => {
    return new Promise((resolve, reject) => {
      const q =
        "UPDATE users SET is_seller='" + isSeller + "' WHERE id='" + id + "'";
      conn.query(q, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  }
};
