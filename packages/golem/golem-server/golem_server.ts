import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { spawn } from 'child_process';
type ChildProcessWithoutNullStreams = any;
import fetch from 'node-fetch';
import { RitualContext, RitualPlan, Incantation } from '../luciform-core/dist/types.js';

export class GolemServer {
  private app: Hono;
  private port: number;
  private clientPort: number;
  private serverInstance: any;
  private luciformCoreProcess: ChildProcessWithoutNullStreams;
  private pendingClientRequests = new Map<string, (value: string) => void>();
  private pendingLuciformCoreRequests = new Map<string, (value: string) => void>();

  constructor(port: number, clientPort: number = 3032) {
    this.port = port;
    this.clientPort = clientPort;
    this.app = new Hono();
    this.setupRoutes();
    this.luciformCoreProcess = this.spawnLuciformCoreProcess();
  }

  private spawnLuciformCoreProcess(): ChildProcessWithoutNullStreams {
    const process = spawn('node', ['../luciform-core/dist/execute_luciform.js'], { stdio: ['pipe', 'pipe', 'pipe'] });

    process.stdout.on('data', (data: Buffer) => {
      const message = data.toString().trim();
      try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.requestId && this.pendingLuciformCoreRequests.has(parsedMessage.requestId)) {
          this.pendingLuciformCoreRequests.get(parsedMessage.requestId)!(parsedMessage.response);
          this.pendingLuciformCoreRequests.delete(parsedMessage.requestId);
        } else {
          console.log(`[Luciform Core STDOUT]: ${message}`);
        }
      } catch (e) {
        console.log(`[Luciform Core STDOUT]: ${message}`);
      }
    });

    process.stderr?.on('data', (data: Buffer) => {
      console.error(`[Luciform Core STDERR]: ${data.toString().trim()}`);
    });

    process.on('close', (code: any) => {
      console.log(`[Luciform Core] Process exited with code ${code}`);
    });

    return process;
  }

  private setupRoutes() {
    this.app.post('/golem/rituel', async (c) => {
      const { input } = await c.req.json();
      if (!input) {
        return c.json({ error: 'Input missing' }, 400);
      }

      try {
        const requestId = Date.now().toString();
        const command = JSON.stringify({ type: 'generate_ritual', input, requestId });
        this.luciformCoreProcess.stdin.write(command + '\n');

        const planResponse = await new Promise<string>((resolve) => {
          this.pendingLuciformCoreRequests.set(requestId, resolve);
        });

        const parsedPlan = JSON.parse(planResponse);
        return c.json({ plan: parsedPlan });
      } catch (err: any) {
        return c.json({ error: 'Internal error', details: err.message || err }, 500);
      }
    });

    this.app.post('/golem/execute', async (c) => {
      const { plan } = await c.req.json() as { plan: RitualPlan };

      const serverAsk = async (q: string): Promise<string> => {
        const requestId = Date.now().toString();
        const incantation: any = { type: 'terminal_question', invocation: q };

        const response = await fetch(`http://localhost:${this.clientPort}/golem/client_action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ incantation, requestId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send question to client: ${response.statusText}`);
        }

        return new Promise<string>((resolve) => {
          this.pendingClientRequests.set(requestId, resolve);
        });
      };

      try {
        const requestId = Date.now().toString();
        const command = JSON.stringify({ type: 'execute_ritual_plan', plan, context: {} as any, ask: {} as any, requestId });
        this.luciformCoreProcess.stdin.write(command + '\n');

        const resultsResponse = await new Promise<string>((resolve) => {
          this.pendingLuciformCoreRequests.set(requestId, resolve);
        });

        const parsedResults = JSON.parse(resultsResponse);
        return c.json({ resultats: parsedResults });
      } catch (err: any) {
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
      } else {
        return c.text('Request ID not found or already processed.', 404);
      }
    });
  }

  public start() {
    this.serverInstance = serve({ fetch: this.app.fetch, port: this.port });
    console.log(`[Golem Server] ✨ Listening on http://localhost:${this.port}`);
    return this.serverInstance;
  }

  public async stop() {
    if (this.serverInstance) {
      await new Promise<void>((resolve, reject) => {
        this.serverInstance.close((err: any) => {
          if (err) reject(err); else resolve();
        });
      });
    }
    if (this.luciformCoreProcess) {
      this.luciformCoreProcess.kill();
    }
  }
}

if (require.main === module) {
  const port = parseInt(process.env.GOLEM_PORT || '3031', 10) || 3031;
  const clientPort = parseInt(process.env.GOLEM_CLIENT_PORT || '3032', 10) || 3032;
  const server = new GolemServer(port, clientPort);
  server.start();
}
