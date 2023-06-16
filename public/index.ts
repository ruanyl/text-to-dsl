import './index.scss';

import { MyTestPluginPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new MyTestPluginPlugin();
}
export { MyTestPluginPluginSetup, MyTestPluginPluginStart } from './types';
