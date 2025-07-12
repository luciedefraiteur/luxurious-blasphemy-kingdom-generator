import { LuciformDocument, Operation, ActionNode, JsonActionNode, MessageActionNode, AIHelpRequestActionNode } from '../../luciform-types/src/base.js';

export async function executeLuciform(document: LuciformDocument, logRitual: (message: string, logFileName?: string) => Promise<void>, getAIHelp: (rawContent: string, reason: string) => Promise<ActionNode>, logFileName?: string): Promise<void> {
  logRitual(`Executor: Starting execution of Luciform document.`, logFileName);

  for (const pasNode of document.pas) {
    logRitual(`Executor: Processing PAS node: ${pasNode.content.substring(0, 50)}...`, logFileName);

    let actionToExecute: ActionNode | null = pasNode.action;

    // If the action is an AI help request, get help from the AI interface
    if (actionToExecute && actionToExecute.type === 'ai_help_request') {
      const aiHelpRequest = actionToExecute as AIHelpRequestActionNode;
      logRitual(`Executor: AI help request detected. Raw content: ${aiHelpRequest.rawContent}`, logFileName);
      actionToExecute = await getAIHelp(aiHelpRequest.rawContent, aiHelpRequest.reason);
    }

    if (actionToExecute) {
      switch (actionToExecute.type) {
        case 'json_action':
          const jsonAction = actionToExecute as JsonActionNode;
          await executeOperation(jsonAction.operation, logRitual, logFileName);
          break;
        case 'message':
          const messageAction = actionToExecute as MessageActionNode;
          logRitual(`Executor: Message: ${messageAction.message}`, logFileName);
          break;
        // Add other action types here as needed
        default:
          logRitual(`Executor Error: Unknown action type: ${actionToExecute.type}`, logFileName);
          break;
      }
    }
  }
  logRitual(`Executor: Luciform document execution complete.`, logFileName);
}

async function executeOperation(operation: Operation, logRitual: (message: string, logFileName?: string) => Promise<void>, logFileName?: string): Promise<void> {
  switch (operation.type) {
    case 'shell_command':
      // Placeholder for shell command execution
      logRitual(`Executing shell command: ${operation.command}`, logFileName);
      // In a real implementation, this would run the command
      break;
    case 'create_file':
      // Placeholder for file creation
      logRitual(`Creating file: ${operation.filePath} with content: ${operation.content.substring(0, 50)}...`, logFileName);
      // In a real implementation, this would create the file
      break;
    case 'message':
      // This case should ideally be handled by the ActionNode switch, but included for completeness
      logRitual(`Operation Message: ${operation.message}`, logFileName);
      break;
    // Add other operation types here
    default:
      logRitual(`Executor Error: Unknown operation type: ${operation.type}`, logFileName);
      break;
  }
}