import Ember from 'ember';
import getData from '../utils/get-data';

export default Ember.Route.extend({
  model: function() {
    return {
      databases: []
    };
  },

  afterModel: function() {
    this.loadSamples();
  },

  loadSamples: function() {
    var model = this.modelFor('application');
    var newData = getData();
    var databaseArray = [];

    Object.keys(newData.databases).forEach((dbname) => {
      var sampleInfo = newData.databases[dbname];

      if (!model.databases[dbname]) {
        model.databases[dbname] = {
          name: dbname,
          samples: []
        };
      }

      var samples = model.databases[dbname].samples;
      samples.push({
        time: newData.start_at,
        queries: sampleInfo.queries
      });
      if (samples.length > 5) {
        samples.splice(0, samples.length - 5);
      }

      databaseArray.push(model.databases[dbname]);
    });

    Ember.set(model, 'databaseArray', databaseArray);

    Monitoring.renderRate.ping(); // jshint ignore:line
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
