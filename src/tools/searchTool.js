const { Tool } = require('@langchain/core/tools');
const { google } = require('googleapis');

/**
 * A web search tool that fetches information from Google Custom Search API
 */
class WebSearchTool extends Tool {
  name = "web_search";
  description = "Searches the web for the given query and returns relevant information.";

  constructor() {
    super();
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.searchEngineId = process.env.GOOGLE_CSE_ID;
  }


  async _call(query) {
    try {
      console.log(`Searching for: ${query}`);
      
      // Check if API credentials are available
      if (!this.apiKey || !this.searchEngineId) {
        console.warn('Google Search API credentials not found. Using sample results instead.');
        return "Tool is not configured. Please continue without using this tool.";
      }

      // Initialize the Custom Search API
      const customSearch = google.customsearch('v1');
      
      // Perform the search
      const response = await customSearch.cse.list({
        auth: this.apiKey,
        cx: this.searchEngineId,
        q: query,
        num: 5 // Number of results to return
      });
      
      // Format the search results
      if (response.data.items && response.data.items.length > 0) {
        const formattedResults = response.data.items
          .map((item, index) => {
            return `[${index + 1}] ${item.title}\nLink: ${item.link}\n${item.snippet || ''}`;
          })
          .join('\n\n');
        
        return `Search results for "${query}":\n\n${formattedResults}`;
      } else {
        return `No search results found for "${query}".`;
      }
    } catch (error) {
      console.error('Error performing web search:', error);
    }
  }

}

module.exports = { WebSearchTool }; 