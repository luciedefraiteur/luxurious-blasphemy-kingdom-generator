"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeLuciform = executeLuciform;
function executeLuciform(document, logRitual, getAIHelp, logFileName) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, pasNode, actionToExecute, aiHelpRequest, _b, jsonAction, messageAction;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    logRitual("Executor: Starting execution of Luciform document.", logFileName);
                    _i = 0, _a = document.pas;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    pasNode = _a[_i];
                    logRitual("Executor: Processing PAS node: ".concat(pasNode.content.substring(0, 50), "..."), logFileName);
                    actionToExecute = pasNode.action;
                    if (!(actionToExecute && actionToExecute.type === 'ai_help_request')) return [3 /*break*/, 3];
                    aiHelpRequest = actionToExecute;
                    logRitual("Executor: AI help request detected. Raw content: ".concat(aiHelpRequest.rawContent), logFileName);
                    return [4 /*yield*/, getAIHelp(aiHelpRequest.rawContent, aiHelpRequest.reason)];
                case 2:
                    actionToExecute = _c.sent();
                    _c.label = 3;
                case 3:
                    if (!actionToExecute) return [3 /*break*/, 8];
                    _b = actionToExecute.type;
                    switch (_b) {
                        case 'json_action': return [3 /*break*/, 4];
                        case 'message': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 7];
                case 4:
                    jsonAction = actionToExecute;
                    return [4 /*yield*/, executeOperation(jsonAction.operation, logRitual, logFileName)];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 6:
                    messageAction = actionToExecute;
                    logRitual("Executor: Message: ".concat(messageAction.message), logFileName);
                    return [3 /*break*/, 8];
                case 7:
                    logRitual("Executor Error: Unknown action type: ".concat(actionToExecute.type), logFileName);
                    return [3 /*break*/, 8];
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9:
                    logRitual("Executor: Luciform document execution complete.", logFileName);
                    return [2 /*return*/];
            }
        });
    });
}
function executeOperation(operation, logRitual, logFileName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (operation.type) {
                case 'shell_command':
                    // Placeholder for shell command execution
                    logRitual("Executing shell command: ".concat(operation.command), logFileName);
                    // In a real implementation, this would run the command
                    break;
                case 'create_file':
                    // Placeholder for file creation
                    logRitual("Creating file: ".concat(operation.filePath, " with content: ").concat(operation.content.substring(0, 50), "..."), logFileName);
                    // In a real implementation, this would create the file
                    break;
                case 'message':
                    // This case should ideally be handled by the ActionNode switch, but included for completeness
                    logRitual("Operation Message: ".concat(operation.message), logFileName);
                    break;
                // Add other operation types here
                default:
                    logRitual("Executor Error: Unknown operation type: ".concat(operation.type), logFileName);
                    break;
            }
            return [2 /*return*/];
        });
    });
}
