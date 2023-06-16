import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { OpenSearchDashboardsContextProvider } from '../../../src/plugins/opensearch_dashboards_react/public';
import { AppPluginStartDependencies } from './types';
import { MyTestPluginApp } from './components/app';

export const renderApp = (
  coreStart: CoreStart,
  { navigation }: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  ReactDOM.render(
    <OpenSearchDashboardsContextProvider services={{ ...coreStart }}>
      <MyTestPluginApp
        basename={appBasePath}
        notifications={coreStart.notifications}
        http={coreStart.http}
        navigation={navigation}
        savedObjects={coreStart.savedObjects}
      />
    </OpenSearchDashboardsContextProvider>,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
