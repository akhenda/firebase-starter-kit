/* eslint-disable import/no-extraneous-dependencies */
import assert from 'assert';

import { ApolloServer } from '@apollo/server';
import { FirebaseEmulator } from '@tests/__utils__/emulator';
import request from 'supertest';
import { collection } from 'typesaurus';

import { example, planets } from '@src/listeners/servers';
import { resolvers as exampleResolvers, typeDefs as exampleTypeDefs } from '@src/listeners/servers/example/graphql';
import { resolvers as planetsResolvers, typeDefs as planetsTypeDefs } from '@src/listeners/servers/planets/graphql';
import { Planet, PlanetModel } from '@src/models';

const firebase = new FirebaseEmulator();
const { test } = firebase;

/* eslint-disable jest/no-export */
export default () => {
  describe('Express Servers (HTTPS)', () => {
    describe('Example Server', () => {
      it('GET /api ==> returns "Hello, World!" message', async () => {
        const response = await request(example).get('/api');

        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
        expect(response.headers['content-length']).toBe('13');
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual('Hello, World!');
      });

      it('GET /api/error ==> returns the error page', async () => {
        const response = await request(example).get('/api/error');

        expect(response.headers['content-type']).toMatch('text/html');
        expect(response.statusCode).toEqual(500);
      });

      describe('GraphQL', () => {
        let server: ApolloServer;

        const GET_BOOKS = `
          query getBooks {
            books {
              author
              title
            }
          }
        `;

        // before the tests we spin up a new Apollo Server
        beforeAll(() => {
          // create a test server to test against, using our production typeDefs,
          // resolvers, and dataSources.
          server = new ApolloServer({
            resolvers: exampleResolvers,
            typeDefs: exampleTypeDefs,
          });
        });

        // after the tests we'll stop the server
        afterAll(async () => {
          await server?.stop();
        });

        it('gets all books', async () => {
          // run the query against the server and snapshot the output
          const response = await server.executeOperation({ query: GET_BOOKS });

          // Note the use of Node's assert rather than Jest's expect; if using
          // TypeScript, `assert`` will appropriately narrow the type of `body`
          // and `expect` will not.
          assert(response.body.kind === 'single');

          expect(response.body.singleResult.errors).toBeUndefined();
          expect(response).toMatchSnapshot();
        });
      });
    });

    describe('Planets Server', () => {
      it('GET /api ==> returns "Hello, All Planets!" message', async () => {
        const response = await request(planets).get('/api');

        expect(response.headers['content-type']).toMatch(/text\/html; charset=utf-8/i);
        expect(response.headers['content-length']).toEqual('19');
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual('Hello, All Planets!');
      });

      it('POST /api/snap-finger ==> returns "Half of the total population..." message', async () => {
        const planetsToWipe = 'Xandar, Vormir, Titan and Earth';
        const response = await request(planets).post('/api/snap-finger').send({
          planets: planetsToWipe,
        });

        expect(response.headers['content-type']).toMatch(/application\/json; charset=utf-8/i);
        expect(response.headers['content-length']).toEqual('90');
        expect(response.statusCode).toEqual(201);
        expect(response.body.message).toEqual(`Half of the total population in ${planetsToWipe} exterminated`);
      });

      describe('GraphQL', () => {
        let server: ApolloServer;

        const testPlanet = {
          habitable: true,
          id: 'xandar1111',
          name: 'Xandar',
        };

        const ADD_PLANET = `
          mutation AddPlanet($name: String!, $habitable: Boolean!) {
            addPlanet(name: $name, habitable: $habitable)
          }
        `;

        const GET_PLANET = `
          query GetPlanet($id: ID!) {
            planet(id: $id) {
              id
              name
              habitable
            }
          }
        `;

        const GET_PLANETS = `
          query GetPlanets {
            planets {
              id
              name
              habitable
            }
          }
        `;

        // before the tests we spin up a new Apollo Server
        beforeAll(() => {
          // create a test server to test against, using our production typeDefs,
          // resolvers, and dataSources.
          server = new ApolloServer({
            resolvers: planetsResolvers,
            typeDefs: planetsTypeDefs,
          });

          const { id, name, habitable } = testPlanet;
          const planetsCollection = collection('planets');

          jest.spyOn(PlanetModel, 'create').mockResolvedValue({ __type__: 'ref', collection: planetsCollection, id });

          jest.spyOn(PlanetModel, 'getOne').mockResolvedValue({
            __type__: 'doc',
            data: { habitable, name },
            meta: { fromCache: false, hasPendingWrites: false },
            ref: { __type__: 'ref', collection: planetsCollection, id: testPlanet.id },
          });

          jest.spyOn(PlanetModel, 'getAll').mockResolvedValue([
            {
              __type__: 'doc',
              data: { habitable: false, name: 'Mars' },
              meta: { fromCache: false, hasPendingWrites: false },
              ref: { __type__: 'ref', collection: planetsCollection, id: 'mars-123' },
            },
            {
              __type__: 'doc',
              data: { habitable: true, name: 'Earth' },
              meta: { fromCache: false, hasPendingWrites: false },
              ref: { __type__: 'ref', collection: planetsCollection, id: 'earth-616' },
            },
            {
              __type__: 'doc',
              data: { habitable, name },
              meta: { fromCache: false, hasPendingWrites: false },
              ref: { __type__: 'ref', collection: planetsCollection, id: testPlanet.id },
            },
          ]);
        });

        // after the tests we'll stop the server
        afterAll(async () => {
          await server?.stop();

          test.cleanup();
        });

        it('adds a planet', async () => {
          const response = await server.executeOperation({
            query: ADD_PLANET,
            variables: { habitable: false, name: 'Mars' },
          });

          assert(response.body.kind === 'single');
          expect(response.body.singleResult.errors).toBeUndefined();
          expect(response.body.singleResult.data?.addPlanet).toBeDefined();
        });

        it('gets a planet', async () => {
          // run the query against the server and snapshot the output
          const response = await server.executeOperation({ query: GET_PLANET, variables: { id: testPlanet.id } });

          // Note the use of Node's assert rather than Jest's expect; if using
          // TypeScript, `assert`` will appropriately narrow the type of `body`
          // and `expect` will not.
          assert(response.body.kind === 'single');

          expect(response.body.singleResult.errors).toBeUndefined();
          expect((response.body.singleResult.data?.planet as Planet)?.id).toBe(testPlanet.id);
          expect((response.body.singleResult.data?.planet as Planet)?.name).toBe(testPlanet.name);
          expect((response.body.singleResult.data?.planet as Planet)?.habitable).toBeTrue();
        });

        it('gets all planets', async () => {
          // run the query against the server and snapshot the output
          const response = await server.executeOperation({ query: GET_PLANETS });

          // Note the use of Node's assert rather than Jest's expect; if using
          // TypeScript, `assert`` will appropriately narrow the type of `body`
          // and `expect` will not.
          assert(response.body.kind === 'single');

          expect(response.body.singleResult.errors).toBeUndefined();
          expect(response).toMatchSnapshot();
        });
      });
    });
  });
};
