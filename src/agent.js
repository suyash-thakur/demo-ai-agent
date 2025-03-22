const { StateGraph, END, START } = require('@langchain/langgraph');
const { ChatOpenAI } = require('@langchain/openai');
const { WebSearchTool } = require('./tools/searchTool');
const { HumanMessage } = require('@langchain/core/messages');
const { ToolNode } = require('@langchain/langgraph/prebuilt');
const { MessagesAnnotation } = require('@langchain/langgraph');

// Initialize the OpenAI chat model
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// Create instances of our tools
const webSearchTool = new WebSearchTool();

// Create an array of tools available to the agent
const tools = [webSearchTool];

// Define the system message for the agent
const systemMessage = `You are a helpful AI assistant with access to tools.
Use these tools to provide accurate and helpful responses to user questions.
- Use the web_search tool for factual information

When using tools:
1. Think about which tool is most appropriate for the question
2. Format tool calls properly with the required parameters
3. Wait for tool responses before making conclusions
4. Analyze the tool results carefully to extract relevant information
5. If the results are not helpful, try reformulating your query

Be concise and direct in your answers.`;

// Bind tools to the model
const modelWithTools = model.bindTools(tools);

// Create the tool node
const toolNode = new ToolNode(tools);

// Function to decide whether to continue or finish
function shouldContinue(state) {
  const lastMessage = state.messages[state.messages.length - 1];
  
  // If the LLM makes a tool call, route to the tools node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  
  // Otherwise, finish
  return END;
}

// Function to call the model
async function callModel(state) {
  // Get all messages with the system prompt at the beginning
  const messages = [
    { role: "system", content: systemMessage },
    ...state.messages,
  ];
  
  // Call the model
  const response = await modelWithTools.invoke(messages);
  
  // Return the messages with the new response added
  return { messages: [...state.messages, response] };
}

// Build the agent graph
function buildAgentGraph() {
  // Create a new graph with messages state
  const workflow = new StateGraph(MessagesAnnotation);
  
  // Add nodes to the graph
  workflow.addNode("agent", callModel);
  workflow.addNode("tools", toolNode);
  
  // Define the edges of the graph
  workflow.addEdge(START, "agent");
  
  // Add conditional edges based on tool usage
  workflow.addConditionalEdges("agent", shouldContinue);
  
  // Connect tools back to agent
  workflow.addEdge("tools", "agent");
  
  // Compile the workflow
  return workflow.compile();
}

// Function to run the agent graph
async function runAgent(question) {
  try {
    // Build the agent graph
    const agentGraph = buildAgentGraph();
    
    // Execute the agent graph
    const result = await agentGraph.invoke({
      messages: [new HumanMessage(question)],
    });
    
    // Process the result to return a string response
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.content;
  } catch (error) {
    console.error('Error running agent:', error);
    return `Error: ${error.message}`;
  }
}

// Export the LangGraph agent
module.exports = { runAgent };