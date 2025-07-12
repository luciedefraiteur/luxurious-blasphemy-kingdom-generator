import { expect } from 'chai';
import { GolemClient } from './golem_client.js';
import { GolemServer } from '../golem-server/golem_server.js';
import * as http from 'http';

describe('GolemClient', () => {
  let golemServer: GolemServer;
  let serverInstance: http.Server;
  const TEST_SERVER_PORT = 3033; // Use a different port for testing
  const TEST_CLIENT_PORT = 3034; // Use a different port for testing

  before(async () => {
    // Start the Golem Server
    golemServer = new GolemServer(TEST_SERVER_PORT, TEST_CLIENT_PORT);
    serverInstance = golemServer.start();
    await new Promise<void>(resolve => serverInstance.on('listening', resolve));
    console.log(`Test Golem Server listening on port ${TEST_SERVER_PORT}`);
  });

  after(async () => {
    // Stop the Golem Server
    await golemServer.stop();
    console.log(`Test Golem Server stopped.`);
  });

  it('should send a command to the Golem server and receive a response', async () => {
    const client = new GolemClient(`http://localhost:${TEST_SERVER_PORT}`, TEST_CLIENT_PORT);
    client.startListener();
    await new Promise<void>(resolve => setTimeout(resolve, 100)); // Give client listener a moment to start

    const command = 'test command';
    const response: any = await client.sendCommand(command);

    expect(response).to.have.property('resultats');
    expect(response.resultats).to.be.an('array');
    // The actual plan content depends on luciform-core's response, which is mocked here.
    // For a real test, you'd mock luciform-core's behavior or have a known response.
    // For now, we'll just check for the presence of a plan.

    client.stopListener();
  }).timeout(10000); // Increase timeout for server startup and communication
});
