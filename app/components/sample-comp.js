import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  topFiveQueries: (function() {
    var ary;
    ary = this.get('content.queries').slice(0, 5);
    while (ary.length < 5) {
      ary.push({
        query: ""
      });
    }
    return ary;
  }).property('content.queries.@each'),
  queriesCountLabelClass: (function() {
    var count;
    count = this.get('content.nbQueries');
    if (count >= 20) {
      return "label-important";
    }
    if (count >= 10) {
      return "label-warning";
    }
    return "label-success";
  }).property('content.queries.@each')
});
