import React, { useState, useEffect } from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  EuiSelect,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import { Query } from './query';

interface MyTestPluginAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  savedObjects: CoreStart['savedObjects'];
}

export const MyTestPluginApp = ({
  basename,
  notifications,
  http,
  navigation,
  savedObjects,
}: MyTestPluginAppDeps) => {
  const [indexPatternNames, setIndexPatternNames] = useState<string[]>([]);
  const [selectedIndexPattern, setSelectedIndexPattern] = useState('');
  const [fields, setFields] = useState<any>({});

  useEffect(() => {
    async function getIndexPatterns() {
      const result = await savedObjects.client.find<{ title: string; fields: string }>({
        type: 'index-pattern',
      });
      console.log(result);
      const names = result.savedObjects.map((s) => {
        return s.attributes.title;
      });
      setIndexPatternNames(names);
      setSelectedIndexPattern(names[0]);
    }
    getIndexPatterns();
  }, []);

  useEffect(() => {
    async function setIndexPatternFields() {
      if (selectedIndexPattern) {
        const result = await http.get(`/api/my_test_plugin/index/${selectedIndexPattern}`);
        const fields = result?.body?.[selectedIndexPattern]?.mappings;
        if (fields) {
          setFields(fields);
        }
        console.log(fields);
        // const result = await savedObjects.client.find<{ title: string; fields: string }>({
        //   type: 'index-pattern',
        //   searchFields: ['title'],
        //   search: `"${selectedIndexPattern}"`,
        // });
        // const all = JSON.parse(result.savedObjects[0].attributes.fields).filter(
        //   (f: any) => !f.name.includes('.') && !f.name.startsWith('_')
        // );
        // //.map((f: any) => ({ name: f.name, type: f.type }));
        // setFields(all);
        // console.log(result.savedObjects[0].attributes.fields);
        // console.log(all);
      }
    }
    setIndexPatternFields();
  }, [selectedIndexPattern]);

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu
            appName={PLUGIN_ID}
            showSearchBar={true}
            useDefaultBehaviors={true}
          />
          <EuiPage restrictWidth="1000px">
            <EuiPageBody component="main">
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="myTestPlugin.helloWorldText"
                      defaultMessage="{name}"
                      values={{ name: 'QueryGPT' }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>
              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      <FormattedMessage
                        id="myTestPlugin.congratulationsTitle"
                        defaultMessage="OpenSearch with Natural Language"
                      />
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <EuiSelect
                    value={selectedIndexPattern}
                    options={indexPatternNames.map((name) => ({ value: name, text: name }))}
                    onChange={(e) => setSelectedIndexPattern(e.target.value)}
                  />
                  <Query indexPattern={selectedIndexPattern} fields={fields} />
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
