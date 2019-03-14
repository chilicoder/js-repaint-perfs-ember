import Route from '@ember/routing/route';
import getData from '../utils/get-data';
import { bind }  from '@ember/runloop';
import { set }  from '@ember/object';
export default class ApplicationRoute extends Route {
  model() {
    return {
      databaseArray: []
    };
  }

  afterModel() {
    super.afterModel(...arguments);
    this.loadSamples();
  }

  loadSamples() {
    const model = this.modelFor('application');
    set(model, 'databaseArray', getData());
    window.Monitoring && window.Monitoring.renderRate.ping();
    requestAnimationFrame(bind(this, this.loadSamples));
  }
}
