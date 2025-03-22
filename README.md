# AI Agent Demo 

A simple AI agent built with LangGraph and Google Search integration.

## Installation

1. Clone this repository:
```bash
git clone https://github.com/suyash-thakur/demo-ai-agent.git
cd ai-agent-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_custom_search_engine_id_here
```

4. Link the CLI globally (optional):
```
npm link
```

## API Setup Instructions

### OpenAI API Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Generate a new API key
4. Copy the key to your `.env` file

### Google Custom Search API
1. Create a Google Cloud project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the "Custom Search API" in the Google Cloud Console
3. Create API credentials to get your API key
4. Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/) to create a search engine
5. Configure your search engine and get your Search Engine ID (cx)
6. Add both the API key and Search Engine ID to your `.env` file

## Features

- Advanced LangGraph-based agent implementation:
  - Uses StateGraph for sophisticated conversation flow
  - Integrated with GPT-4o-mini model for intelligent responses
  - Fallback mechanisms for handling API errors
- Robust Web Search Integration:
  - Real-time information retrieval via Google Custom Search API
  - Graceful fallback to sample responses when API credentials are missing
  - Formatted search results with titles, links, and snippets
- Modern Architecture:
  - Built with latest versions of LangChain and LangGraph
  - Modular tool system for easy extensibility
  - Environment-based configuration
  - Node.js v16+ compatible
