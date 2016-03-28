const Promise = require('bluebird');

const db = require('../../db');
const nano = db.nano;
const database = db.database;

/**
 * Inserts a doc into a database. If the database doesn't exist, create
 * the database, and then save the doc.
 *
 * insert_doc({nano: true}, 'database_name' , 0);
 *
 * @param {Object} doc - document
 * @param {Integer} tried
 */

function insert_doc(doc, id, tried) {
  return new Promise(function(fullfill, reject) {

    db.insert(doc, id,
      function (error,http_body,http_headers) {
        if(error) {
          if(error.message === 'no_db_file'  && tried < 1) {
            // create database and retry
            return nano.db.create(db_name, function () {
              insert_doc(doc, db_name, tried + 1);
              fullfill(http_body);
            });
          }
          else { return reject(error) }
        }
        fullfill(http_body);
    });

  });
}

module.exports = insert_doc;
