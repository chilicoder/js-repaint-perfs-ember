var ENV = window.ENV; // jshint ignore:line

export default function getData() {
  return ENV.generateData().toArray();
}