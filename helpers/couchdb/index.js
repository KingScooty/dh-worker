const Promise = require('bluebird');

const DB_NAME = require('../../db');

const config =  require('../../config/').database;
const host = config.host;
const user = config.auth.username;
const pass = config.auth.password;

const nano = require('nano')(`http://${user}:${pass}@${host}`);
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

 // const insert_doc = function insert_doc(doc, db_name, tried) {
 //   var db = nano.use(db_name);

const insert_doc = function insert_doc(doc, id, tried) {
  return new Promise(function(fullfill, reject) {

    database.insert(doc, id,
      function (error,http_body,http_headers) {
        if(error) {
          if(error.message === 'no_db_file'  && tried < 1) {
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

module.exports = { insert_doc };
