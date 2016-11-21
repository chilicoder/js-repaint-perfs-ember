import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'td',
  classNames: ['Query', 'query', 'elapsed', 'elapsedClass'], //elapsedClass iconClass " Query query elapsed"
  elapsedClass: Ember.computed('content.elapsed', function () {
    var elapsed;
    elapsed = this.get('content.elapsed');
    if (elapsed >= 10.0) {
      return "warn_long";
    }
    if (elapsed >= 1.0) {
      return "warn";
    }
    return "short";
  }),
  vacuum: Ember.computed('content.query', function () {
    var query;
    query = this.get('content.query').toLowerCase();
    return query.indexOf('vacuum') > -1 || query.indexOf('reorg') > -1;
  }),
  idle: Ember.computed('content.query', function () {
    return this.get('content.query').indexOf('<IDLE>') > -1;
  })
});
