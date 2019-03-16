const ENV = window.ENV;

export default function getData() {
  return ENV.generateData().toArray();
}