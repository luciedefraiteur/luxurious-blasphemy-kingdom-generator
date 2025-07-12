"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const GOLEM_SERVER_URL = 'http://localhost:' + (process.env.GOLEM_PORT || 3031);
async function sendCommand(command) {
    try {
        console.log(`[Golem Test Client] Sending command: ${command}`);
        const response = await (0, node_fetch_1.default)(`${GOLEM_SERVER_URL}/golem/rituel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: command })
        });
        const data = await response.json();
        if (response.ok) {
            console.log(`[Golem Test Client] Received plan: ${JSON.stringify(data.plan, null, 2)}`);
            // Optionally, execute the plan here if needed for full test flow
            // For now, just planning is enough for a basic test client
        }
        else {
            console.error(`[Golem Test Client] Error from server: ${data.error || response.statusText}`);
        }
    }
    catch (error) {
        console.error(`[Golem Test Client] Communication error: ${error.message}`);
    }
}
async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log("Usage: npm run test:golem-client -- \"<command>\"");
        return;
    }
    const command = args.join(' ');
    await sendCommand(command);
}
main().catch(console.error);
//# sourceMappingURL=golem_test_client.js.map