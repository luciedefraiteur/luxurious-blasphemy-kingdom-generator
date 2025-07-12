export declare class GolemClient {
    private serverUrl;
    private clientPort;
    private rl;
    private app;
    private server;
    constructor(serverUrl: string, clientPort?: number);
    private ask;
    private setupClientActions;
    startListener(): void;
    stopListener(): void;
    sendCommand(input: string): Promise<{
        error?: string;
        plan?: any;
    } | {
        error?: string;
        resultats?: any;
    }>;
    main(commands?: string[]): Promise<void>;
}
