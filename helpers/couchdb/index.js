const Promise = require('bluebird');

const DB_NAME = require('../../db');

const config =  require('../../config/').database;
const host = config.host;
let nano;

if (process.env.NODE_ENV === "production") {
  const user = config.auth.username;
  const pass = config.auth.password;

  nano = require('nano')(`http://${user}:${pass}@${host}`);
} else {
  nano = require('nano')(`http://${host}`);
}


const database = nano.use(DB_NAME);

/**
 * Inserts a doc into a database. If the database doesn't exist, create
 * the database, and then save the doc.
 *
 * insert_doc({nano: true}, 'docName' , 0);
 *
 * @param {Object} doc - document
 * @param {String} docName
 * @param {Integer} tried
 */

const insert_doc = function insert_doc(doc, id, tried) {
  return new Promise(function(fullfill, reject) {

    database.insert(doc, id,
      function (error,http_body,http_headers) {
        if(error) {
          if(error.message === 'no_db_file' && tried < 1) {
            // create database and retry
            return nano.db.create(DB_NAME, function () {
              insert_doc(doc, id, tried + 1);
              fullfill(http_body);
            });
          }
          else { return reject(error) }
        }
        fullfill(http_body);
    });

  });
}

/**
 * Bulk inserts an array of docs into a database. If the database doesn't exist,
 * create the database, and then save the doc.
 *
 * bulk_insert_doc({nano: true} , 0);
 *
 * @param {Array} doc - array of documents
 * @param {Integer} tried
 */

const bulk_insert_doc = function bulk_insert_doc(docs, DB_NAME, tried) {
  const database = nano.use(DB_NAME);

  return new Promise(function(fullfill, reject) {

    database.bulk(docs, function(error, http_body, http_headers) {
      if (error) {
        if (error.message === 'no_db_file' && tried < 1) {
          console.log(error);
          console.log(error.reason);
          // create database and retry
          return nano.db.create(DB_NAME, function () {
            bulk_insert_doc(docs, DB_NAME, tried + 1);
            fullfill(http_body);
          });
        }
        else { return reject(error) }
      }
      fullfill(http_body);
    });

  });
}

module.exports = {
  insert_doc,
  bulk_insert_doc
};
