"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GolemClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const readline = __importStar(require("readline"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const system_handler_1 = require("luciform-core/system_handler");
class GolemClient {
    constructor(serverUrl, clientPort = 3032) {
        this.ask = (query) => new Promise(resolve => this.rl.question(query, resolve));
        this.serverUrl = serverUrl;
        this.clientPort = clientPort;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.app = (0, express_1.default)();
        this.app.use(body_parser_1.default.json());
        this.setupClientActions();
    }
    setupClientActions() {
        this.app.post('/golem/client_action', (async (req, res) => {
            const { incantation, requestId } = req.body;
            let outcome;
            let success = true;
            try {
                switch (incantation.type) {
                    case 'terminal_output':
                        process.stdout.write(incantation.invocation + '\n');
                        outcome = `[OK] Printed to terminal: ${incantation.invocation}`;
                        break;
                    case 'terminal_command':
                        const commandResult = await (0, system_handler_1.handleSystemCommand)(incantation.invocation, process.cwd(), {}); // Mock context
                        outcome = commandResult.stdout;
                        success = commandResult.success;
                        process.stdout.write(`[TERMINAL COMMAND RESULT] ${outcome}\n`);
                        break;
                    case 'terminal_question':
                        process.stdout.write(`[TERMINAL QUESTION] ${incantation.invocation}\n`);
                        outcome = await this.ask('↳ Your response: ');
                        break;
                    default:
                        success = false;
                        outcome = `[ERROR] Unknown incantation type for client action: ${incantation.type}`;
                        console.error(outcome);
                }
            }
            catch (error) {
                success = false;
                outcome = `[ERROR] Client action failed: ${error.message}`;
                console.error(outcome);
            }
            if (incantation.type === 'terminal_command' || incantation.type === 'terminal_question') {
                await (0, node_fetch_1.default)(`${this.serverUrl}/golem/client_response`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requestId, response: outcome, success })
                });
            }
            res.status(200).send('OK');
        }));
    }
    startListener() {
        this.server = this.app.listen(this.clientPort, () => {
            console.log(`[Golem Client] Client listener active on http://localhost:${this.clientPort}`);
        });
    }
    stopListener() {
        if (this.server) {
            this.server.close();
        }
    }
    async sendCommand(input) {
        try {
            const planResponse = await (0, node_fetch_1.default)(`${this.serverUrl}/golem/rituel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input })
            });
            const planData = await planResponse.json();
            if (planData.error) {
                console.error("[Golem Client] Error planning ritual:", planData.error);
                return planData; // Return error data for testing
            }
            console.log("[Golem Client] Received plan:", JSON.stringify(planData.plan, null, 2));
            const executeResponse = await (0, node_fetch_1.default)(`${this.serverUrl}/golem/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planData.plan })
            });
            const executeData = await executeResponse.json();
            if (executeData.error) {
                console.error("[Golem Client] Error executing ritual:", executeData.error);
                return executeData; // Return error data for testing
            }
            else {
                console.log("[Golem Client] Ritual execution results:", JSON.stringify(executeData.resultats, null, 2));
                return executeData; // Return results for testing
            }
        }
        catch (error) {
            console.error("[Golem Client] Communication error with Golem Server:", error);
            throw error; // Re-throw for testing to catch communication issues
        }
    }
    async main(commands = []) {
        console.log("\n[Golem Client] Connected to Golem Server.");
        this.startListener();
        if (commands.length > 0) {
            for (const input of commands) {
                console.log(`[Golem Client] Processing command: ${input}`);
                await this.sendCommand(input);
            }
        }
        else {
            while (true) {
                const input = await this.ask("[Golem Client] Enter your command (or 'exit'): ");
                if (input.toLowerCase() === 'exit') {
                    break;
                }
                await this.sendCommand(input);
            }
        }
        this.rl.close();
        this.stopListener();
    }
}
exports.GolemClient = GolemClient;
const GOLEM_SERVER_URL = 'http://localhost:' + (process.env.GOLEM_PORT || 3031);
const GOLEM_CLIENT_PORT = parseInt(process.env.GOLEM_CLIENT_PORT || '3032', 10);
if (require.main === module) {
    const client = new GolemClient(GOLEM_SERVER_URL, GOLEM_CLIENT_PORT);
    client.main(process.argv.slice(2)).catch(console.error);
}
//# sourceMappingURL=golem_client.js.map