const conn = require("../configs/connection");

module.exports = {
  getAll: (offset, limit, sort, sortBy, search) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM admins WHERE (name LIKE '%${search}%') 
          ORDER BY ${sortBy} ${sort} LIMIT ${offset}, ${limit}`;

      conn.query(sql, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },

  getAdminById: id_admin => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM admins WHERE id='" + id_admin + "'";
      conn.query(sql, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },

  createAdmin: data => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO admins SET ?";
      conn.query(sql, data, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  updateAdmin: (id, data) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE admins SET ? WHERE id = ?";

      conn.query(sql, [data, id], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
          console.log(err);
        }
      });
    });
  },

  deleteAdmin: id => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM sellers WHERE id='" + id + "'";
      conn.query(sql, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  }
};
