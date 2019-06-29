import {Lb4SpMongoApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new Lb4SpMongoApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: Lb4SpMongoApplication;
  client: Client;
}