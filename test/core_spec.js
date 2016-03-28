var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;
chai.should();


var couch_helpers = require('../helpers/couchdb');
var stream = require('../index');

console.log(stream);

describe('Worker', () => {
  var insert_doc;

  before(function() {
    var response = new Promise(function(fullfill, reject) {
      fullfill({});
    });

    insert_doc = sinon.stub(couch_helpers, "insert_doc").returns(response);
  });

  it('saves tweet to database when detected', (done) => {
    stream.emit('tweet', {id_str: "123456789"});
    sinon.assert.calledOnce(insert_doc);
    sinon.assert.calledWith(insert_doc, {id_str: "123456789", type: "tweet"});
    done();
  });
});
