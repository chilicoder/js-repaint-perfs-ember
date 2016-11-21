import Ember from 'ember';

const ENV = {
  rows: 50,
  timeout: 0
};
var loadCount = 0;
var Database = Ember.Object.extend({
  name: null,
  hostname: null,
  samples: null,
  latestSample: (function () {
    var samples;
    samples = this.get('samples');
    if ((samples == null) || samples.get('length') === 0) {
      return {};
    }
    return samples.objectAt(samples.get('length') - 1);
  }).property('samples.@each')
});

Database.reopenClass({
  _all: Ember.ArrayProxy.create({
    content: []
  }),
  find: function (name) {
    return this._all.findBy('name', name);
  },
  findAll: function () {
    return this._all;
  },
  _get: function (name) {
    var cached, db;
    cached = this.find(name);
    if (cached) {
      return cached;
    }
    db = this.create({
      name: name,
      samples: Ember.ArrayProxy.create()
    });
    db.get('samples').set('content', []);
    this._all.pushObject(db);
    return db;
  },
  loadLatest: function () {
    var data, db, dbname, i, info, q, r, url, _i, _j, _ref, _results;
    data = {
      start_at: new Date().getTime() / 1000,
      databases: {}
    };
    for (i = _i = 1; _i <= ENV.rows; i = ++_i) {
      data.databases["cluster" + i] = {
        queries: []
      };
      data.databases["cluster" + i + "slave"] = {
        queries: []
      };
    }
    _ref = data.databases;
    _results = [];
    for (dbname in _ref) {
      info = _ref[dbname];
      r = Math.floor((Math.random() * 10) + 1);
      for (i = _j = 0; 0 <= r ? _j <= r : _j >= r; i = 0 <= r ? ++_j : --_j) {
        q = {
          canvas_action: null,
          canvas_context_id: null,
          canvas_controller: null,
          canvas_hostname: null,
          canvas_job_tag: null,
          canvas_pid: null,
          elapsed: Math.random() * 15,
          query: "SELECT blah FROM something",
          waiting: Math.random() < 0.5
        };
        if (Math.random() < 0.2) {
          q.query = "<IDLE> in transaction";
        }
        if (Math.random() < 0.1) {
          q.query = "vacuum";
        }
        info.queries.push(q);
      }
      info.queries = info.queries.sort(function (a, b) {
        return b.elapsed - a.elapsed;
      });
      db = this._get(dbname);
      _results.push(db.get('samples').pushObject({
        time: data.start_at,
        queries: info.queries
      }));
    }
    Ember.run.later(function () {
      loadCount++;
      // const start = Date.now();
      Database.loadLatest();
      // console.log(Date.now()-start);
      Monitoring.renderRate.ping();
    }, ENV.timeout);
  }
});

export default Ember.Route.extend({
  model: function () {
    return Database.findAll();
  },
  activate: function () {
    //console.log("loading!");
    Database.loadLatest();
    //return this.interval = setInterval(function() {
    //Database.loadLatest();
    //}, 1000);
  },
  deactivate: function () {
    return clearInterval(this.interval);
  }
});
