import { schema } from '@osd/config-schema';

import { IRouter } from '../../../../src/core/server';

export function defineRoutes(router: IRouter) {
  console.log('defineRoutes');
  router.post(
    {
      path: '/api/my_test_plugin/run',
      validate: {
        body: schema.object({
          query: schema.string(),
          indexPattern: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      console.log('request body: ', request.body);
      const res = await context.core.opensearch.client.asCurrentUser.transport.request({
        method: 'GET',
        path: `/${request.body.indexPattern}/_search`,
        body: request.body.query,
      });
      return response.ok({
        body: res,
      });
    }
  );

  router.get(
    {
      path: '/api/my_test_plugin/index/{indexName}',
      validate: {
        params: schema.object({
          indexName: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      console.log('request params: ', request.params);
      const res = await context.core.opensearch.client.asCurrentUser.transport.request({
        method: 'GET',
        path: `/${request.params.indexName}`,
      });
      return response.ok({
        body: res,
      });
    }
  );
}
