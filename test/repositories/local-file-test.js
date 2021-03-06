/*
 * remote-file-test.js: Tests for LocalFile repository.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

require.paths.unshift(require('path').join(__dirname, '..', '..', 'lib'));

var vows = require('vows'),
    path = require('path'),
    fs = require('fs'),
    eyes = require('eyes'),
    assert = require('assert'),
    haibu = require('haibu'), 
    helpers = require('./../helpers');

var ipAddress = '127.0.0.1', 
    port = 9000, 
    app = {
       "name": "test",
       "user": "marak",
       "directories": {
         "home": "hellonode"
       },
       "repository": {
         "type": "local",
         "directory": path.join(__dirname, '..', 'fixtures', 'repositories', 'local-file'),
       },
       "scripts": {
         "start": "server.js"
       }
    };
    
vows.describe('haibu/repositories/local-file').addBatch(helpers.requireInit()).addBatch({
  "When using haibu": {
    "an instance of the LocalFile repository": {
      topic: function () {
        return haibu.repository.create(app);
      },
      "should be a valid repository": function (localFile) {
        assert.equal(haibu.repository.validate(localFile.app).valid, true);
        assert.isFunction(localFile.init);
        assert.isFunction(localFile.exists);
        assert.isFunction(localFile.update);
        assert.isFunction(localFile.fetch);
      },
      "the fetch() method": {
        topic: function (localFile) {
          localFile.fetch(this.callback);
        },
        "use the local filesystem": function (err, localFile) {
          try {
            assert.isNotNull(fs.statSync(localFile));
          }
          catch (ex) {
            // If this operation fails, fail the test
            assert.isNull(ex);
          }
        }
      }
    }
  }
}).export(module);