// daos/ClientDAO.js
const db = require('../db_config');

class ClientDAO {
  create(name, contactInfo, callback) {
    const sql = "INSERT INTO clients (name, contact_info) VALUES ($1, $2) RETURNING *";
    db.query(sql, [name, contactInfo], (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows[0]);
    });
  }

  findAll(callback) {
    const sql = "SELECT * FROM clients ORDER BY name ASC";
    db.query(sql, [], (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows);
    });
  }

  findById(id, callback) {
    const sql = "SELECT * FROM clients WHERE client_id = $1";
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows[0]);
    });
  }

  update(id, name, contactInfo, callback) {
    const sql = "UPDATE clients SET name = $1, contact_info = $2 WHERE client_id = $3 RETURNING *";
    db.query(sql, [name, contactInfo, id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows[0]);
    });
  }

  delete(id, callback) {
    // Consider implications: what happens to sales orders associated with a deleted client?
    // For now, a simple delete. You might prefer soft deletes or disallowing deletes if orders exist.
    const sql = "DELETE FROM clients WHERE client_id = $1 RETURNING *";
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows[0]); // Returns the deleted row
    });
  }
}

module.exports = new ClientDAO();