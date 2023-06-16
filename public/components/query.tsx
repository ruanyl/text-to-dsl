import {
  EuiButton,
  EuiFormRow,
  EuiTextArea,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCodeBlock,
  EuiFieldSearch,
  EuiIcon,
  EuiLoadingChart,
  EuiCode,
  EuiText,
  EuiLoadingSpinner,
  EuiBasicTable,
} from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { useOpenSearchDashboards } from '../../../../src/plugins/opensearch_dashboards_react/public';
import { translate } from './query_api';

interface Props {
  indexPattern: string;
  fields: string[];
}

export const Query = ({ indexPattern, fields }: Props) => {
  const {
    services: { http },
  } = useOpenSearchDashboards();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [rawQuery, setRawQuery] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState();

  const onTranslate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setQuery('');
    setResult(undefined);
    try {
      const dsl = await translate(
        rawQuery,
        indexPattern,
        fields.map((f: any) => `${f.name}(${f.type})`)
      );
      setQuery(dsl);
      console.log(dsl);
    } catch (e) {
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    setQuery('');
    setResult(undefined);
  }, [indexPattern]);

  useEffect(() => {
    async function run() {
      if (http && query) {
        setSearching(true);
        try {
          const res = await http.post('/api/my_test_plugin/run', {
            body: JSON.stringify({ query: query, indexPattern: indexPattern }),
          });
          setResult(res.body.hits?.hits?.map((h: any) => h._source));
        } catch (e) {
        } finally {
          setSearching(false);
        }
      }
    }
    run();
  }, [query]);

  const columns = fields.slice(0, 7).map((f: any) => ({ name: f.name, field: f.name }));

  return (
    <div style={{ marginTop: 20 }}>
      <EuiFlexGroup direction="column">
        <EuiFlexItem style={{ flexDirection: 'row' }}>
          <EuiFieldSearch
            fullWidth
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
          />
          <EuiButton
            style={{ width: 120, marginLeft: 10 }}
            isLoading={loading || searching}
            onClick={onTranslate}
          >
            Search
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          {loading && (
            <div style={{ flexDirection: 'row' }}>
              <EuiLoadingChart size="m" mono /> <span>Thinking...</span>
            </div>
          )}
          {!loading && query && (
            <>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <EuiIcon type="check" color="green" />
                <EuiText size="xs" style={{ marginLeft: 5 }}>
                  Based on the index pattern and query you provided, this following DSL query might
                  be useful:
                </EuiText>
              </div>
              <EuiSpacer size="xs" />
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {searching && <EuiLoadingSpinner size="m" />}
                {!searching && result && <EuiIcon type="check" color="green" />}
                <EuiText size="xs" style={{ marginLeft: 5 }}>
                  Searching with DSL:
                  <EuiCode language="json">{query}</EuiCode>
                </EuiText>
              </div>
            </>
          )}
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      {result && <EuiBasicTable columns={columns} items={result} />}
    </div>
  );
};
