import { PluginInitializerContext } from '../../../src/core/server';
import { MyTestPluginPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new MyTestPluginPlugin(initializerContext);
}

export { MyTestPluginPluginSetup, MyTestPluginPluginStart } from './types';
