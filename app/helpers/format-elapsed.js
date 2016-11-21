import Ember from 'ember';

export function formatElapsed([value]/*, hash*/) {
  var comps, minutes, ms, seconds, str;
  str = parseFloat(value).toFixed(2);
  if (value > 60) {
    minutes = Math.floor(value / 60);
    comps = (value % 60).toFixed(2).split('.');
    seconds = comps[0].lpad('0', 2);
    ms = comps[1];
    str = "" + minutes + ":" + seconds + "." + ms;
  }
  return str;
}

export default Ember.Helper.helper(formatElapsed);
