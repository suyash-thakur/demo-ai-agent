#!/usr/bin/env node

require('dotenv').config();
const { runAgent } = require('./src/agent');

// Test questions that demonstrate the web search tool capabilities
const testQuestions = [
  "Who won the IPL match on 22nd March 2025?"
];

async function runTests() {
  console.log("Testing AI Agent with Google Search API\n");
  
  // Check if Google API credentials are set
  if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_CSE_ID) {
    console.warn('\n⚠️  Warning: Google Search API credentials are not set in .env file.');
    console.warn('The search tool will fall back to simulated results.\n');
  } else {
    console.log('✓ Google Search API credentials found in .env file.\n');
  }
  
  // Test LangGraph agent
  console.log('\n===== Testing LangGraph Agent =====');
  for (const question of testQuestions) {
    console.log(`\n-------------------------------------`);
    console.log(`Question: ${question}`);
    console.log(`-------------------------------------`);
    
    try {
      const response = await runAgent(question);
      console.log(`\nAI Response:\n${response}\n`);
    } catch (error) {
      console.error(`Error with question "${question}":`, error.message);
    }
  }
  
  console.log("\nAll tests completed!");
}

// Run the tests
runTests().catch(console.error); 