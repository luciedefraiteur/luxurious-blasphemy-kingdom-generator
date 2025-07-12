"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMModel = void 0;
var LLMModel;
(function (LLMModel) {
    LLMModel["Mistral"] = "mistral";
    LLMModel["Claude"] = "claude";
    LLMModel["GPT4"] = "gpt-4";
    LLMModel["GPT3_5_Turbo"] = "gpt-3.5-turbo";
    LLMModel["GeminiPro"] = "gemini-pro";
    LLMModel["CodeLlama"] = "codellama:7b-instruct";
    LLMModel["CodeLlamaCode"] = "codellama:7b-code";
    LLMModel["Llama3"] = "llama3";
    LLMModel["OpenAI"] = "openai";
    LLMModel["Gemini"] = "gemini";
    LLMModel["Random"] = "random";
})(LLMModel || (exports.LLMModel = LLMModel = {}));
