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


  loadSamples: function () {
    var model = this.modelFor('application');
    Ember.set(model, 'databaseArray', getData());
    Monitoring.renderRate.ping(); // jshint ignore:line
    requestAnimationFrame(Ember.run.bind(this, this.loadSamples));
  }
});
