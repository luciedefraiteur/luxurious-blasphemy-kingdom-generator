"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const golem_client_js_1 = require("./golem_client.js");
const golem_server_js_1 = require("../golem-server/golem_server.js");
describe('GolemClient', () => {
    let golemServer;
    let serverInstance;
    const TEST_SERVER_PORT = 3033; // Use a different port for testing
    const TEST_CLIENT_PORT = 3034; // Use a different port for testing
    before(async () => {
        // Start the Golem Server
        golemServer = new golem_server_js_1.GolemServer(TEST_SERVER_PORT, TEST_CLIENT_PORT);
        serverInstance = golemServer.start();
        await new Promise(resolve => serverInstance.on('listening', resolve));
        console.log(`Test Golem Server listening on port ${TEST_SERVER_PORT}`);
    });
    after(async () => {
        // Stop the Golem Server
        await golemServer.stop();
        console.log(`Test Golem Server stopped.`);
    });
    it('should send a command to the Golem server and receive a response', async () => {
        const client = new golem_client_js_1.GolemClient(`http://localhost:${TEST_SERVER_PORT}`, TEST_CLIENT_PORT);
        client.startListener();
        await new Promise(resolve => setTimeout(resolve, 100)); // Give client listener a moment to start
        const command = 'test command';
        const response = await client.sendCommand(command);
        (0, chai_1.expect)(response).to.have.property('resultats');
        (0, chai_1.expect)(response.resultats).to.be.an('array');
        // The actual plan content depends on luciform-core's response, which is mocked here.
        // For a real test, you'd mock luciform-core's behavior or have a known response.
        // For now, we'll just check for the presence of a plan.
        client.stopListener();
    }).timeout(10000); // Increase timeout for server startup and communication
});
//# sourceMappingURL=golem_client.test.js.map