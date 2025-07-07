import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export class ErrorHandler {
  /**
   * Processes Climatiq API errors and converts them to appropriate MCP errors
   * @param error - The original error from the API call
   * @param apiKey - The API key used (for masking in error messages)
   * @returns A properly formatted McpError
   */
  static handleClimatiqError(error: any, apiKey: string): McpError {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      // Mask API key for security (show first 4 and last 4 characters)
      const maskedApiKey = apiKey 
        ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
        : "NOT_SET";
      
      if (status === 401) {
        const serverError = errorData?.error || error.response.statusText || "Unknown server error";
        return new McpError(
          ErrorCode.InternalError,
          `Invalid Climatiq API key (${maskedApiKey}). Server response: ${serverError}. Please check your API key configuration.`
        );
      } else if (status === 403) {
        const serverError = errorData?.error || error.response.statusText || "Unknown server error";
        return new McpError(
          ErrorCode.InternalError,
          `Climatiq API access forbidden with key ${maskedApiKey}. Server response: ${serverError}. Check your API key permissions and subscription.`
        );
      } else if (status === 429) {
        const serverError = errorData?.error || error.response.statusText || "Unknown server error";
        return new McpError(
          ErrorCode.InternalError,
          `Climatiq API rate limit exceeded with key ${maskedApiKey}. Server response: ${serverError}. Please try again later or upgrade your plan.`
        );
      } else {
        const serverError = errorData?.error || error.response.statusText || "Unknown server error";
        return new McpError(
          ErrorCode.InternalError,
          `Climatiq API error (${status}) with key ${maskedApiKey}. Server response: ${serverError}. Full error data: ${JSON.stringify(errorData)}`
        );
      }
    } else {
      return new McpError(
        ErrorCode.InternalError,
        `Network error: ${errorMessage}. API key used: ${apiKey ? "SET" : "NOT_SET"}`
      );
    }
  }

  /**
   * Creates a generic MCP error for missing API key
   * @returns McpError for missing API key
   */
  static createMissingApiKeyError(): McpError {
    return new McpError(
      ErrorCode.InternalError,
      "Climatiq API key not configured. Please set CLIMATIQ_API_KEY environment variable."
    );
  }

  /**
   * Creates a generic MCP error for unknown tools
   * @param toolName - The name of the unknown tool
   * @returns McpError for unknown tool
   */
  static createUnknownToolError(toolName: string): McpError {
    return new McpError(
      ErrorCode.MethodNotFound,
      `Tool ${toolName} not found`
    );
  }

  /**
   * Creates a generic MCP error for tool execution failures
   * @param toolName - The name of the tool that failed
   * @param error - The original error
   * @returns McpError for tool execution failure
   */
  static createToolExecutionError(toolName: string, error: any): McpError {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new McpError(
      ErrorCode.InternalError,
      `Error executing tool ${toolName}: ${errorMessage}`
    );
  }
} 