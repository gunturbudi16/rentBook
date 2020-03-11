const conn = require("../configs/connection");

module.exports = {
  register: data => {
    return new Promise((resolve, reject) => {
      conn.query("INSERT INTO users SET ?", data, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },

  getPassword: email => {
    return new Promise((resolve, reject) => {
      conn.query(
        "SELECT password FROM users WHERE email='" + email + "'",
        (err, pass) => {
          if (!err) {
            resolve(pass);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },

  getUser: async (email, password) => {
    return new Promise((resolve, reject) => {
      conn.query(
        "SELECT * FROM users WHERE email='" +
          email +
          "' AND password='" +
          password +
          "'",
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },

  getEmail: email => {
    return new Promise((resolve, reject) => {
      conn.query(
        "SELECT * FROM users WHERE email='" + email + "'",
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },

  changePassword: (email, password) => {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE users SET password='" +
        password +
        "' WHERE email='" +
        email +
        "'";
      conn.query(query, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },

  update: (id, isAdmin) => {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE users SET is_admin='" + isAdmin + "' WHERE id='" + id + "'";
      conn.query(query, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  }
};
