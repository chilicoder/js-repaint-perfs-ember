import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Database.find(params.name);
  }
});
