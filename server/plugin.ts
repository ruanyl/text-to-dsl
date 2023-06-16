import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { MyTestPluginPluginSetup, MyTestPluginPluginStart } from './types';
import { defineRoutes } from './routes';

export class MyTestPluginPlugin
  implements Plugin<MyTestPluginPluginSetup, MyTestPluginPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.info('myTestPlugin: Setup');
    const router = core.http.createRouter();
    this.logger.info('myTestPlugin: create router');

    // Register server side APIs
    defineRoutes(router);
    this.logger.info('myTestPlugin: router created');

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('myTestPlugin: Started');
    return {};
  }

  public stop() {}
}
