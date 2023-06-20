export const toDSL = async (query: string, indexName: string, fields: any) => {
  // let prompt = `I have an OpenSearch index which has the following fields: ${tableSchema}\n\n`;
  // if (tableSchema) {
  //   prompt = `${prompt}${query}.\n\nCan you help me generate the OpenSearch DSL?`;
  // }
  const response = await fetch('http://43.206.149.144:8080/generate/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, index: indexName, fields }),
  });

  const data = await response.text();
  if (!response.ok) {
    console.log(response);
  }

  return data;
};

export const toSQL = async (query: string, schema: string[] = []) => {
  // let prompt = `I have an OpenSearch index which has the following fields: ${tableSchema}\n\n`;
  // if (tableSchema) {
  //   prompt = `${prompt}${query}.\n\nCan you help me generate the OpenSearch DSL?`;
  // }
  const response = await fetch('http://43.206.149.144:8082/generate/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, schema }),
  });

  const data = await response.text();
  if (!response.ok) {
    console.log(response);
  }

  return data;
};
