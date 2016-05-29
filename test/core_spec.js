var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.should();
chai.use(sinonChai);


var couch_helpers = require('../helpers/couchdb');
var stream = require('../index');

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

    expect(insert_doc).to.have.been.calledWith({
      id_str: '123456789', type: 'tweet'
    });
    expect(insert_doc).to.have.been.calledOnce;
    done();
  });
});
