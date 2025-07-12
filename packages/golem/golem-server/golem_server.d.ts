export declare class GolemServer {
    private app;
    private port;
    private clientPort;
    private serverInstance;
    private luciformCoreProcess;
    private pendingClientRequests;
    private pendingLuciformCoreRequests;
    constructor(port: number, clientPort?: number);
    private spawnLuciformCoreProcess;
    private setupRoutes;
    start(): any;
    stop(): Promise<void>;
}
