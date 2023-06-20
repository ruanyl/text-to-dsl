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
import { toDSL, toSQL } from './query_api';

interface Props {
  indexPattern: string;
  fields: any;
}

export const Query = ({ indexPattern, fields }: Props) => {
  const {
    services: { http },
  } = useOpenSearchDashboards();
  const [loading, setLoading] = useState(false);
  const [sqlLoading, setSQLLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [rawQuery, setRawQuery] = useState('');
  const [dsl, setDSL] = useState('');
  const [sql, setSQL] = useState('');
  const [result, setResult] = useState();

  const onTranslate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setDSL('');
    setSQL('');
    setResult(undefined);
    try {
      const dsl = await toDSL(rawQuery, indexPattern, fields);
      setDSL(dsl);
      console.log(dsl);
      setLoading(false);

      setSQLLoading(true);
      const sql = await toSQL(rawQuery, Object.keys(fields.properties));
      setSQL(sql);
      console.log(dsl);
      setSQLLoading(false);
    } catch (e) {
      setLoading(false);
      setSQLLoading(false);
    }
  };

  useEffect(() => {
    setDSL('');
    setSQL('');
    setResult(undefined);
  }, [indexPattern]);

  useEffect(() => {
    async function run() {
      if (http && dsl) {
        setSearching(true);
        try {
          const res = await http.post('/api/my_test_plugin/run', {
            body: JSON.stringify({ query: dsl, indexPattern: indexPattern }),
          });
          setResult(res.body.hits?.hits?.map((h: any) => h._source));
        } catch (e) {
        } finally {
          setSearching(false);
        }
      }
    }
    run();
  }, [dsl]);

  //const columns = fields.slice(0, 7).map((f: any) => ({ name: f.name, field: f.name }));
  const columns = fields.properties
    ? Object.keys(fields.properties)
        .slice(0, 7)
        .map((f: any) => ({ name: f, field: f }))
    : [];
  console.log(columns);

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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <EuiLoadingChart size="m" mono />{' '}
              <EuiText style={{ paddingLeft: 5 }} size="s">
                Thinking...
              </EuiText>
            </div>
          )}
          {!loading && dsl && (
            <>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <EuiIcon type="check" color="green" />
                <EuiText size="s" style={{ marginLeft: 5 }}>
                  Based on the index pattern and query you provided, this following DSL query might
                  be useful:
                </EuiText>
              </div>
              <EuiSpacer size="s" />
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {searching && <EuiLoadingSpinner size="m" />}
                {!searching && result && <EuiIcon type="check" color="green" />}
                <EuiText size="s" style={{ marginLeft: 5 }}>
                  Searching with DSL:
                  <EuiCode language="json">{dsl}</EuiCode>
                </EuiText>
              </div>
            </>
          )}
          {sqlLoading && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <EuiLoadingChart size="m" mono />{' '}
              <EuiText style={{ paddingLeft: 5 }} size="s">
                Thinking of alternatives...
              </EuiText>
            </div>
          )}
          {!sqlLoading && sql && (
            <>
              <EuiSpacer size="s" />
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <EuiText size="s" style={{ marginLeft: 5 }}>
                  💡 Here is an alternative way with SQL, you may give it a try:
                </EuiText>
              </div>
              <EuiSpacer size="s" />
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <EuiText size="s" style={{ marginLeft: 5 }}>
                  <EuiCode language="json">{sql}</EuiCode>
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
