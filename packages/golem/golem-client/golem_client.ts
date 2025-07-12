import fetch from 'node-fetch';
import * as readline from 'readline';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Incantation } from 'luciform-core/types.js';
import { handleSystemCommand } from 'luciform-core/system_handler';

export class GolemClient {
  private serverUrl: string;
  private clientPort: number;
  private rl: readline.Interface;
  private app: express.Application;
  private server: any;

  constructor(serverUrl: string, clientPort: number = 3032) {
    this.serverUrl = serverUrl;
    this.clientPort = clientPort;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.app = express();
    this.app.use(bodyParser.json());
    this.setupClientActions();
  }

  private ask = (query: string): Promise<string> => new Promise(resolve => this.rl.question(query, resolve));

  private setupClientActions() {
    this.app.post('/golem/client_action', (async (req: Request, res: Response) => {
      const { incantation, requestId } = req.body as { incantation: Incantation, requestId: string };
      let outcome: any;
      let success = true;

      try {
        switch (incantation.type) {
          case 'terminal_output':
            process.stdout.write(incantation.invocation + '\n');
            outcome = `[OK] Printed to terminal: ${incantation.invocation}`;
            break;
          case 'terminal_command':
            const commandResult = await handleSystemCommand(incantation.invocation, process.cwd(), {} as any); // Mock context
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
      } catch (error: any) {
        success = false;
        outcome = `[ERROR] Client action failed: ${error.message}`;
        console.error(outcome);
      }

      if (incantation.type === 'terminal_command' || incantation.type === 'terminal_question') {
        await fetch(`${this.serverUrl}/golem/client_response`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId, response: outcome, success })
        });
      }

      res.status(200).send('OK');
    }) as any);
  }

  public startListener() {
    this.server = this.app.listen(this.clientPort, () => {
      console.log(`[Golem Client] Client listener active on http://localhost:${this.clientPort}`);
    });
  }

  public stopListener() {
    if (this.server) {
      this.server.close();
    }
  }

  public async sendCommand(input: string) {
    try {
      const planResponse = await fetch(`${this.serverUrl}/golem/rituel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const planData = await planResponse.json() as { error?: string; plan?: any };

      if (planData.error) {
        console.error("[Golem Client] Error planning ritual:", planData.error);
        return planData; // Return error data for testing
      }

      console.log("[Golem Client] Received plan:", JSON.stringify(planData.plan, null, 2));

      const executeResponse = await fetch(`${this.serverUrl}/golem/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planData.plan })
      });
      const executeData = await executeResponse.json() as { error?: string; resultats?: any };

      if (executeData.error) {
        console.error("[Golem Client] Error executing ritual:", executeData.error);
        return executeData; // Return error data for testing
      } else {
        console.log("[Golem Client] Ritual execution results:", JSON.stringify(executeData.resultats, null, 2));
        return executeData; // Return results for testing
      }

    } catch (error) {
      console.error("[Golem Client] Communication error with Golem Server:", error);
      throw error; // Re-throw for testing to catch communication issues
    }
  }

  public async main(commands: string[] = []) {
    console.log("\n[Golem Client] Connected to Golem Server.");
    this.startListener();

    if (commands.length > 0) {
      for (const input of commands) {
        console.log(`[Golem Client] Processing command: ${input}`);
        await this.sendCommand(input);
      }
    } else {
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

const GOLEM_SERVER_URL = 'http://localhost:' + (process.env.GOLEM_PORT || 3031);
const GOLEM_CLIENT_PORT = parseInt(process.env.GOLEM_CLIENT_PORT || '3032', 10);

if (require.main === module) {
  const client = new GolemClient(GOLEM_SERVER_URL, GOLEM_CLIENT_PORT);
  client.main(process.argv.slice(2)).catch(console.error);
}
