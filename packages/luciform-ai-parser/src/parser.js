"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLuciformDocument = parseLuciformDocument;
var tokenizer_1 = require("./tokenizer");
var types_1 = require("./types");
function getAIHelp(rawContent, reason, logRitual, logFileName) {
    logRitual("AI HELP: Requesting assistance for: ".concat(reason), logFileName);
    logRitual("AI HELP: Raw content: ".concat(rawContent), logFileName);
    return { type: 'ai_help_request', rawContent: rawContent, reason: reason };
}
function parseLuciformDocument(luciformContent, logRitual, logFileName) {
    var _a;
    // Try parsing as JSON (for .spell or complex .luciform files) first
    try {
        var json = JSON.parse(luciformContent);
        if (json.type === 'spell' && json.action) {
            // Convert spell JSON to a LuciformDocument structure
            var actionNode = { type: 'json_action', operation: json.action };
            var pasNode = { type: 'Pas', content: json.description || '', action: actionNode };
            return { type: 'LuciformDocument', pas: [pasNode], sygil: json.sygil || undefined };
        }
        else if (json.luciform && Array.isArray(json.luciform)) {
            // Handle top-level JSON with a 'luciform' array
            var pasNodes_1 = json.luciform.map(function (item) {
                if (item.pas && item.action) {
                    return { type: 'Pas', content: item.pas, action: parseAction(JSON.stringify(item.action), logRitual, logFileName) };
                }
                else {
                    throw new Error("Invalid PAS structure in top-level luciform array.");
                }
            });
            return { type: 'LuciformDocument', pas: pasNodes_1, sygil: ((_a = json.meta) === null || _a === void 0 ? void 0 : _a.signature_totem) || undefined };
        }
    }
    catch (e) {
        // Not a JSON spell file or complex luciform, fall through to legacy parser
    }
    var tokenizer = tokenizer_1.Tokenizer.tokenize(luciformContent);
    var tokens = tokenizer;
    var currentTokenIndex = 0;
    var consume = function (expectedType) {
        var token = tokens[currentTokenIndex];
        if (token && token.type === expectedType) {
            currentTokenIndex++;
            return token;
        }
        else {
            throw new Error("Expected token type ".concat(expectedType, " but got ").concat(token ? token.type : 'EOF', " at line ").concat(token === null || token === void 0 ? void 0 : token.line, ", column ").concat(token === null || token === void 0 ? void 0 : token.column));
        }
    };
    var peek = function () {
        return tokens[currentTokenIndex];
    };
    var skipNewlines = function () {
        while (peek().type === types_1.TokenType.NEWLINE) {
            consume(types_1.TokenType.NEWLINE);
        }
    };
    var sygil;
    if (peek().type === types_1.TokenType.LUCIFORM_SYGIL) {
        sygil = consume(types_1.TokenType.LUCIFORM_SYGIL).value;
        skipNewlines();
    }
    var parseAction = function (actionContent, logRitual, logFileName) {
        logRitual("Parser: Parsing action content: ".concat(actionContent.substring(0, 50), "..."), logFileName);
        var trimmedContent = actionContent.trim();
        // Try to parse as JSON first for structured operations
        if (trimmedContent.startsWith('{')) {
            var jsonString = trimmedContent;
            // Check for template literals within the JSON string (e.g., for multi-line strings)
            var templateLiteralRegex = /`([\s\S]*?)`/g;
            jsonString = jsonString.replace(templateLiteralRegex, function (match, content) {
                // Escape newlines and double quotes within the template literal content
                var escapedContent = content.replace(/\n/g, '\n').replace(/"/g, '"');
                return "\"".concat(escapedContent, "\"");
            });
            try {
                var operation = JSON.parse(jsonString);
                if (operation && typeof operation.type === 'string') {
                    logRitual("Parser: Parsed JSON action of type: ".concat(operation.type), logFileName);
                    return { type: 'json_action', operation: operation };
                }
            }
            catch (error) {
                return getAIHelp(trimmedContent, "JSON parsing failed: ".concat(error.message), logRitual, logFileName);
            }
        }
        // Handle non-JSON operations like 'promenade'
        var promenadeMatch = trimmedContent.match(/^promenade:\s*(.*)/);
        if (promenadeMatch && promenadeMatch[1] !== undefined) {
            logRitual("Parser: Parsed Promenade action: ".concat(promenadeMatch[1].trim()), logFileName);
            return { type: 'promenade', description: promenadeMatch[1].trim() };
        }
        // If no other match, treat as a message to shadeOs
        logRitual("Parser: Parsed Message action: ".concat(trimmedContent), logFileName);
        return { type: 'message', message: trimmedContent };
    };
    var parseLegacyCommand = function (command, logRitual, logFileName) {
        logRitual("Parser: Parsing legacy command: ".concat(command), logFileName);
        var match = command.match(/^§(.*?):(.*)$/);
        if (!match) {
            logRitual("Parser Error: Invalid legacy command format: ".concat(command), logFileName);
            return getAIHelp(command, "Invalid legacy command format", logRitual, logFileName);
        }
        var key = match[1];
        var value = match[2].trim();
        switch (key) {
            case 'F':
                logRitual("Parser: Parsed legacy Create File command: ".concat(value), logFileName);
                return { type: 'json_action', operation: { type: 'create_file', filePath: value, content: '' } };
            case 'S':
                logRitual("Parser: Parsed legacy Search command: ".concat(value), logFileName);
                return { type: 'json_action', operation: { type: 'search_and_replace', filePath: '', search: value, replace: '' } };
            case 'R':
                logRitual("Parser: Parsed legacy Replace command: ".concat(value), logFileName);
                return { type: 'json_action', operation: { type: 'search_and_replace', filePath: '', search: '', replace: value } };
            case 'I':
                logRitual("Parser: Parsed legacy Insert command: ".concat(value), logFileName);
                return { type: 'json_action', operation: { type: 'insert', filePath: '', lineNumber: 0, newContent: value } };
            case 'A':
                logRitual("Parser: Parsed legacy Append command: ".concat(value), logFileName);
                return { type: 'json_action', operation: { type: 'append', filePath: '', newContent: value } };
            case 'X':
                logRitual("Parser: Parsed legacy Shell Command: ".concat(value), logFileName);
                return { type: 'json_action', operation: { type: 'shell_command', command: value } };
            // Add other legacy commands here...
            default:
                return getAIHelp(command, "Unknown legacy command key: ".concat(key), logRitual, logFileName);
        }
    };
    var parsePas = function () {
        var pasContent = '';
        var actionNode = null;
        // Skip leading newlines within a pas block before collecting content
        skipNewlines();
        while (peek().type !== types_1.TokenType.PAS_SEPARATOR && peek().type !== types_1.TokenType.EOF) {
            var token = peek();
            if (token.type === types_1.TokenType.ACTION_START) {
                consume(types_1.TokenType.ACTION_START);
                var actionBlockContent = '';
                // Consume content until the next PAS_SEPARATOR or EOF
                while (peek().type !== types_1.TokenType.PAS_SEPARATOR && peek().type !== types_1.TokenType.EOF) {
                    var actionToken = peek();
                    if (actionToken.type === types_1.TokenType.NEWLINE) {
                        consume(types_1.TokenType.NEWLINE);
                        actionBlockContent += '\n';
                    }
                    else {
                        actionBlockContent += consume(actionToken.type).value;
                    }
                }
                actionNode = parseAction(actionBlockContent, logRitual, logFileName);
                logRitual("Parser: Detected and parsed action block.", logFileName);
                break; // Action block found, stop parsing pas content
            }
            else if (token.type === types_1.TokenType.LEGACY_COMMAND) {
                actionNode = parseLegacyCommand(consume(types_1.TokenType.LEGACY_COMMAND).value, logRitual, logFileName);
                logRitual("Parser: Detected and parsed legacy command.", logFileName);
            }
            else {
                pasContent += consume(token.type).value;
            }
        }
        var pasNode = { type: 'Pas', content: pasContent.trim(), action: actionNode };
        logRitual("Parser: Parsed PAS block: ".concat(pasContent.trim().substring(0, 50), "..."), logFileName);
        return pasNode;
    };
    var pasNodes = [];
    // Skip any leading newlines in the document
    skipNewlines();
    // If the document starts with a PAS_SEPARATOR, consume it
    if (peek().type === types_1.TokenType.PAS_SEPARATOR) {
        consume(types_1.TokenType.PAS_SEPARATOR);
        skipNewlines(); // Skip newlines after the initial PAS_SEPARATOR
    }
    while (peek().type !== types_1.TokenType.EOF) {
        pasNodes.push(parsePas());
        // After parsing a pas, if the next token is a PAS_SEPARATOR, consume it and skip newlines
        if (peek().type === types_1.TokenType.PAS_SEPARATOR) {
            consume(types_1.TokenType.PAS_SEPARATOR);
            skipNewlines();
        }
    }
    return { type: 'LuciformDocument', pas: pasNodes, sygil: sygil };
}
