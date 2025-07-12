
import { LLMInterface, LLMModel } from '../../luciform-core/llm_interface.js';

async function testLLMInteraction() {
  console.log('--- Testing LLM Interaction ---');

  const llm = new LLMInterface();

  // Test Case 1.1: Simple Prompt
  try {
    console.log('Test Case 1.1: Simple Prompt');
    const response = await llm.send('Hello, world!');
    console.log('  LLM Response:', response);
  } catch (error) {
    console.error('  Error:', error);
  }

  // Test Case 1.2: Complex Prompt
  try {
    console.log('Test Case 1.2: Complex Prompt');
    const conversation = [
      { role: 'user', content: 'What is the capital of France?' },
      { role: 'assistant', content: 'Paris' },
      { role: 'user', content: 'What is a famous landmark there?' },
    ];
    const response = await llm.send(conversation);
    console.log('  LLM Response:', response);
  } catch (error) {
    console.error('  Error:', error);
  }

  // Test Case 1.3: Error Handling (requires a way to simulate an error)
}

testLLMInteraction();
