export interface KardiaSphere {
    agapePhobos: number;
    logosPathos: number;
    harmoniaEris: number;
}
export type IncantationType = 'traverse' | 'enact' | 'divine' | 'lull' | 'discourse' | 'query' | 'response' | 'pre_execution_check' | 'user_confirmation' | 'code_generation' | 'assisted_editing' | 'user_input' | 'step_proposal' | 'dream_navigation' | 'reflection_navigation' | 'add_reflection' | 'surveil' | 'terminal_command' | 'terminal_output' | 'terminal_question';
export interface Incantation {
    type: IncantationType;
    invocation: string;
    purpose?: string;
    estimated_duration?: string;
}
export interface RitualPlan {
    title: string;
    goal: string;
    incantations: Incantation[];
    complexity: string;
    sequence?: number;
}
export interface CommandOutcome {
    stdout: string;
    stderr: string;
    exitCode: number | null;
    success: boolean;
    error?: string;
}
export interface StepResult {
    incantation: Incantation;
    index: number;
    outcome: string;
    stderr?: string;
    exitCode?: number | null;
    success?: boolean;
    divination?: {
        poeticAnalysis: string;
        suggestedNextStep: string;
    };
    [key: string]: any;
}
export interface RitualExecutionStatus {
    success: boolean;
    completedSteps: number;
    totalSteps: number;
    failedStep?: number;
    error?: string;
    movementFrame?: MovementFrame;
}
export interface VectorInscription {
    timestamp: string;
    pastAction: string;
    presentIntent: string;
    futurePlan: string;
}
export interface Conduit {
    lastIncantation: string;
    lastOutcome: string;
    currentSanctum: string;
    terminalEssence: string;
    osEssence: string;
    protoConsciousness: string;
    support: string;
    memory: string;
    state: string;
    energy: string;
    glitchFactor: number;
    almaInfluence: number;
    eliInfluence: number;
}
export interface LuciePresence {
    lastUpdated: string;
    status: string;
}
export interface Persona {
    name: string;
    description: string;
    job?: {
        prompt: string;
    };
    llm_model?: LLMModel;
}
export declare enum LLMModel {
    Mistral = "mistral",
    Claude = "claude",
    GPT4 = "gpt-4",
    GPT3_5_Turbo = "gpt-3.5-turbo",
    GeminiPro = "gemini-pro",
    CodeLlama = "codellama:7b-instruct",
    CodeLlamaCode = "codellama:7b-code",
    Llama3 = "llama3",
    OpenAI = "openai",
    Gemini = "gemini",
    Random = "random"
}
export interface MovementFrame {
    currentStep: number;
    history: {
        step: number;
        outcome: string;
    }[];
    decision: 'next' | 'previous' | 'jumpTo' | 'spawn_golem' | 'continue_lifeform';
    jumpToStep?: number;
    golemConfig?: {
        workspace: string;
        goal: string;
        initialRitual: string;
        persona: string;
    };
}
export interface RitualContext {
    conduit: Conduit;
    kardiaSphere: KardiaSphere;
    scroll: {
        input: string;
        plan: RitualPlan;
    }[];
    maxScrollLength: number;
    incantation_history: string[];
    outcome_history: string[];
    step_results_history: StepResult[];
    narrativeWeaving: any;
    activeReflection: any;
    user_preferences: string;
    chantModeEnabled: boolean;
    current_sanctum: string;
    currentSanctumContent: string;
    operatingSystem: string;
    personality: string;
    lifeSystem: any;
    luciePresence?: LuciePresence;
    hearLucie?: boolean;
    surveilledFiles?: {
        [filePath: string]: string;
    };
    lastCompletedIncantationIndex?: number;
    confusion_counter?: number;
    dreamPath?: string;
    reflectionPath?: string;
    temperatureStatus?: string;
    currentFile?: string;
    fileContent?: string;
    filePointer?: number;
    textBeforePointer?: string;
    textAfterPointer?: string;
    currentDirectory?: string;
}
export interface LuciformDocument {
    type: 'LuciformDocument';
    pas: PasNode[];
    sygil?: string;
    meta?: any;
}
export interface PasNode {
    type: 'Pas';
    content: string;
    action: ActionNode | null;
}
export type Operation = SearchAndReplace | Insert | Delete | Append | ShellCommand | CreateFile | LlmOperation | JsonData | ReadLines | ArcaneInstruction | Prompt | Glob | WebFetch | Test | Output | ErrorOperation | Variable | Update | Help | Debug | Yaml | Key | Query | Batch | Note | Raw | Code | Data | FileOperation | Git | Hash | Info | Json | Log | Message | Name | Option | Path | Result | Status | Text | Url | Value | Warning | Xml | Yes | Zip | ExecuteTypescriptFile | RitualModificationInstruction | ScryOrb | ModulateMemory | EntangleWith | AskLucie | ReflectiveLoop | TransmuteFile | ApplyTransmutation | NavigateFile | ModifyFileAtPointer;
export type ExecutableOperation = ShellCommand | CreateFile | Promenade | AskLucie | AskPersona | Message | ExecuteTypescriptFile | ScryOrb | ModulateMemory | EntangleWith | AskLucie | ReflectiveLoop | TransmuteFile | ApplyTransmutation | NavigateFile | ModifyFileAtPointer;
export interface Promenade {
    type: 'promenade';
    description: string;
}
export interface AskLucie {
    type: 'ask_lucie';
    question: string;
}
export interface AskPersona {
    type: 'ask_persona';
    persona: Persona;
    question: string;
    llm_model?: LLMModel;
}
export interface SearchAndReplace {
    type: 'search_and_replace';
    filePath: string;
    startLine?: number;
    search: string;
    replace: string;
}
export interface Insert {
    type: 'insert';
    filePath: string;
    lineNumber: number;
    newContent: string;
}
export interface Delete {
    type: 'delete';
    filePath: string;
    startLine: number;
    endLine: number;
}
export interface Append {
    type: 'append';
    filePath: string;
    newContent: string;
}
export interface ShellCommand {
    type: 'shell_command';
    command: string;
}
export interface CreateFile {
    type: 'create_file';
    filePath: string;
    content: string;
}
export interface LlmOperation {
    type: 'llm_operation';
    variableName: string;
    model: string;
    prompt: string;
}
export interface JsonData {
    type: 'json_data';
    data: any;
}
export interface ReadLines {
    type: 'read_lines';
    filePath: string;
    startLine: number;
    endLine: number;
}
export interface ArcaneInstruction {
    type: 'arcane_instruction';
    fichier_a_modifier: string;
    instruction: string;
}
export interface Prompt {
    type: 'prompt';
    prompt: string;
}
export interface Glob {
    type: 'glob';
    pattern: string;
}
export interface WebFetch {
    type: 'web_fetch';
    url: string;
}
export interface Test {
    type: 'test';
    command: string;
}
export interface Output {
    type: 'output';
    content: string;
}
export interface ErrorOperation {
    type: 'error';
    message: string;
}
export interface Variable {
    type: 'variable';
    name: string;
}
export interface Update {
    type: 'update';
    instruction: string;
}
export interface Help {
    type: 'help';
    topic: string;
}
export interface Debug {
    type: 'debug';
    message: string;
}
export interface Yaml {
    type: 'yaml';
    content: string;
}
export interface Key {
    type: 'key';
    key: string;
}
export interface Query {
    type: 'query';
    query: string;
}
export interface Batch {
    type: 'batch';
    batch: string;
}
export interface Note {
    type: 'note';
    note: string;
}
export interface Raw {
    type: 'raw';
    raw: string;
}
export interface Code {
    type: 'code';
    code: string;
}
export interface Data {
    type: 'data';
    data: string;
}
export interface FileOperation {
    type: 'file';
    file: string;
}
export interface Git {
    type: 'git';
    git: string;
}
export interface Hash {
    type: 'hash';
    hash: string;
}
export interface Info {
    type: 'info';
    info: string;
}
export interface Json {
    type: 'json';
    json: string;
}
export interface Log {
    type: 'log';
    log: string;
}
export interface Message {
    type: 'message';
    message: string;
}
export interface Name {
    type: 'name';
    name: string;
}
export interface Option {
    type: 'option';
    option: string;
}
export interface Path {
    type: 'path';
    path: string;
}
export interface Result {
    type: 'result';
    result: string;
}
export interface Status {
    type: 'status';
    status: string;
}
export interface Text {
    type: 'text';
    text: string;
}
export interface Url {
    type: 'url';
    url: string;
}
export interface Value {
    type: 'value';
    value: string;
}
export interface Warning {
    type: 'warning';
    warning: string;
}
export interface Xml {
    type: 'xml';
    xml: string;
}
export interface Yes {
    type: 'yes';
    yes: string;
}
export interface Zip {
    type: 'zip';
    zip: string;
}
export interface ExecuteTypescriptFile {
    type: 'execute_typescript_file';
    filePath: string;
}
export interface RitualModificationInstruction {
    type: 'ritual_modification_instruction';
    fichier_a_modifier: string;
    instruction: string;
}
export interface ScryOrb {
    type: 'scry_orb';
    target: string;
    goal: string;
}
export interface ModulateMemory {
    type: 'modulate_memory';
    scope: 'local' | 'persistent';
    action: 'forget' | 'remember';
    target: string;
}
export interface EntangleWith {
    type: 'entangle';
    luciform_path: string;
}
export interface ReflectiveLoop {
    type: 'reflective_loop';
    seed_prompt: string;
    actions: string[];
}
export interface TransmuteFile {
    type: 'transmute_file';
    filePath: string;
    originalContent: string;
    reason: string;
}
export interface ApplyTransmutation {
    type: 'apply_transmutation';
    filePath: string;
    newLuciformContent: string;
}
export interface NavigateFile {
    type: 'navigate_file';
    targetFile: string;
    targetPosition?: number | 'start' | 'end' | 'search';
    searchPattern?: string;
}
export interface ModifyFileAtPointer {
    type: 'modify_file_at_pointer';
    action: 'insert' | 'delete' | 'replace';
    content?: string;
    length?: number;
}
export type ActionNode = PromenadeActionNode | JsonActionNode | MessageActionNode | AskPersonaActionNode | EntangleWithActionNode | ScryOrbActionNode | AIHelpRequestActionNode | SearchAndReplace | Insert | Delete | Append | ShellCommand | CreateFile | LlmOperation | JsonData | ReadLines | ArcaneInstruction | Prompt | Glob | WebFetch | Test | Output | ErrorOperation | Variable | Update | Help | Debug | Yaml | Key | Query | Batch | Note | Raw | Code | Data | FileOperation | Git | Hash | Info | Json | Log | Message | Name | Option | Path | Result | Status | Text | Url | Value | Warning | Xml | Yes | Zip | ExecuteTypescriptFile | RitualModificationInstruction | ScryOrb | ModulateMemory | EntangleWith | AskLucie | ReflectiveLoop | TransmuteFile | ApplyTransmutation | NavigateFile | ModifyFileAtPointer;
export interface PromenadeActionNode {
    type: 'promenade';
    description: string;
}
export interface JsonActionNode {
    type: 'json_action';
    operation: Operation;
}
export interface MessageActionNode {
    type: 'message';
    message: string;
}
export interface AskPersonaActionNode {
    type: 'ask_persona';
    persona: string;
    question: string;
}
export interface EntangleWithActionNode {
    type: 'entangle_with';
    luciform_path: string;
}
export interface ScryOrbActionNode {
    type: 'scry_orb';
    target: string;
    goal: string;
}
export interface AIHelpRequestActionNode {
    type: 'ai_help_request';
    rawContent: string;
    reason: string;
}
