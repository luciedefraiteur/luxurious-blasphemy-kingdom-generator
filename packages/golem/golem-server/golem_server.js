"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GolemServer = void 0;
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const child_process_1 = require("child_process");
const node_fetch_1 = __importDefault(require("node-fetch"));
class GolemServer {
    constructor(port, clientPort = 3032) {
        this.pendingClientRequests = new Map();
        this.pendingLuciformCoreRequests = new Map();
        this.port = port;
        this.clientPort = clientPort;
        this.app = new hono_1.Hono();
        this.setupRoutes();
        this.luciformCoreProcess = this.spawnLuciformCoreProcess();
    }
    spawnLuciformCoreProcess() {
        const process = (0, child_process_1.spawn)('node', ['../luciform-core/dist/execute_luciform.js'], { stdio: ['pipe', 'pipe', 'pipe'] });
        process.stdout.on('data', (data) => {
            const message = data.toString().trim();
            try {
                const parsedMessage = JSON.parse(message);
                if (parsedMessage.requestId && this.pendingLuciformCoreRequests.has(parsedMessage.requestId)) {
                    this.pendingLuciformCoreRequests.get(parsedMessage.requestId)(parsedMessage.response);
                    this.pendingLuciformCoreRequests.delete(parsedMessage.requestId);
                }
                else {
                    console.log(`[Luciform Core STDOUT]: ${message}`);
                }
            }
            catch (e) {
                console.log(`[Luciform Core STDOUT]: ${message}`);
            }
        });
        if (process.stderr) {
            process.stderr.on('data', (data) => {
                console.error(`[Luciform Core STDERR]: ${data.toString().trim()}`);
            });
        }
        process.on('close', (code) => {
            console.log(`[Luciform Core] Process exited with code ${code}`);
        });
        return process;
    }
    setupRoutes() {
        this.app.post('/golem/rituel', async (c) => {
            const { input } = await c.req.json();
            if (!input) {
                return c.json({ error: 'Input missing' }, 400);
            }
            try {
                const requestId = Date.now().toString();
                const command = JSON.stringify({ type: 'generate_ritual', input, requestId });
                this.luciformCoreProcess.stdin.write(command + '\n');
                const planResponse = await new Promise((resolve) => {
                    this.pendingLuciformCoreRequests.set(requestId, resolve);
                });
                const parsedPlan = JSON.parse(planResponse);
                return c.json({ plan: parsedPlan });
            }
            catch (err) {
                return c.json({ error: 'Internal error', details: err.message || err }, 500);
            }
        });
        this.app.post('/golem/execute', async (c) => {
            const { plan } = await c.req.json();
            const serverAsk = async (q) => {
                const requestId = Date.now().toString();
                const incantation = { type: 'terminal_question', invocation: q };
                const response = await (0, node_fetch_1.default)(`http://localhost:${this.clientPort}/golem/client_action`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ incantation, requestId }),
                });
                if (!response.ok) {
                    throw new Error(`Failed to send question to client: ${response.statusText}`);
                }
                return new Promise((resolve) => {
                    this.pendingClientRequests.set(requestId, resolve);
                });
            };
            try {
                const requestId = Date.now().toString();
                const command = JSON.stringify({ type: 'execute_ritual_plan', plan, context: {}, ask: {}, requestId });
                this.luciformCoreProcess.stdin.write(command + '\n');
                const resultsResponse = await new Promise((resolve) => {
                    this.pendingLuciformCoreRequests.set(requestId, resolve);
                });
                const parsedResults = JSON.parse(resultsResponse);
                return c.json({ resultats: parsedResults });
            }
            catch (err) {
                return c.json({ error: 'Execution error', details: err.message || err }, 500);
            }
        });
        this.app.post('/golem/client_response', async (c) => {
            const { requestId, response } = await c.req.json();
            const resolver = this.pendingClientRequests.get(requestId);
            if (resolver) {
                resolver(response);
                this.pendingClientRequests.delete(requestId);
                return c.text('OK', 200);
            }
            else {
                return c.text('Request ID not found or already processed.', 404);
            }
        });
    }
    start() {
        this.serverInstance = (0, node_server_1.serve)({ fetch: this.app.fetch, port: this.port });
        console.log(`[Golem Server] ✨ Listening on http://localhost:${this.port}`);
        return this.serverInstance;
    }
    async stop() {
        if (this.serverInstance) {
            await new Promise((resolve, reject) => {
                this.serverInstance.close((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        }
        if (this.luciformCoreProcess) {
            this.luciformCoreProcess.kill();
        }
    }
}
exports.GolemServer = GolemServer;
if (require.main === module) {
    const port = parseInt(process.env.GOLEM_PORT || '3031');
    const clientPort = parseInt(process.env.GOLEM_CLIENT_PORT || '3032');
    const server = new GolemServer(port, clientPort);
    server.start();
}
//# sourceMappingURL=golem_server.js.map