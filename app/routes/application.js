import Ember from 'ember';
import getData from '../utils/get-data';

export default Ember.Route.extend({
  model: function () {
    return {
      databases: []
    };
  },

  afterModel: function () {
    this.loadSamples();
  },

  _log: Ember.Object.create({
    base: Date.now(),
    one: [],
    two: [],
    three: [],
    four: [],
  }),
  printLogs(){
    var log = this.get('_log');
    if (log.one.length > 100) {
      console.log('render', log.one.reduce((p, i) => {
        return p + i / 100;
      }, 0));
      console.log('generateData', log.two.reduce((p, i) => {
        return p + i / 100;
      }, 0));
      console.log('setModel', log.three.reduce((p, i) => {
        return p + i / 100;
      }, 0));
      this.set('_log', {
        base: Date.now(),
        one: [],
        two: [],
        three: [],
        four: [],
      });
    }

    log.base = Date.now();
  },

  loadSamples: function () {
    var model = this.modelFor('application');
    // var newData = getData();
    var databaseArray = [];
    var log = this.get('_log');
    log.one.push(Date.now() - log.base);
    log.base = Date.now();
    // Object.keys(newData.databases).forEach((dbname) => {
    //   var sampleInfo = newData.databases[dbname];
    //
    //   if (!model.databases[dbname]) {
    //     model.databases[dbname] = {
    //       name: dbname,
    //       samples: []
    //     };
    //   }
    //
    //   var samples = model.databases[dbname].samples;
    //   samples.push({
    //     time: newData.start_at,
    //     queries: sampleInfo.queries
    //   });
    //   if (samples.length > 5) {
    //     samples.splice(0, samples.length - 5);
    //   }
    //
    //   databaseArray.push(model.databases[dbname]);
    // });
    databaseArray = ENV.generateData().toArray(); // jshint ignore:line
    log.two.push(Date.now() - log.base);
    log.base = Date.now();

    Ember.set(model, 'databaseArray', databaseArray);
    log.three.push(Date.now() - log.base);
    log.base = Date.now();
    Monitoring.renderRate.ping(); // jshint ignore:line
    this.printLogs();
    requestAnimationFrame(Ember.run.bind(this, this.loadSamples));
    //     Ember.run.later(function () {
//       loadCount++;
//       // const start = Date.now();
//       Database.loadLatest();
//       // console.log(Date.now()-start);
//       Monitoring.renderRate.ping();
//     }, ENV.timeout);
  }
});
