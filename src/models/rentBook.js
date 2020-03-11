const conn = require("../configs/connection");

module.exports = {
  createRentBook: (id, name) => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO rentBook VALUES ("' +
        id +
        '", "' +
        name +
        '", "", "", "")';
      conn.query(query, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  editRentBook: (id, name, phone, address) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE rentBook SET name="${name}", phone="${phone}", address="${address}" WHERE id="${id}"`;
      conn.query(query, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  getRentBookById: id => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM rentBook WHERE id="${id}"`;
      conn.query(query, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },

  editRentBookPhoto: (id, photo) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE rentBook SET photo = '${photo}' WHERE id = '${id}'`;
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
