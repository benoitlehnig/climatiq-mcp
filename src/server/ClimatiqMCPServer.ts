import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ClimatiqService } from '../services/ClimatiqService.js';
import { ToolHandlers } from './handlers/ToolHandlers.js';
import { TOOL_DEFINITIONS } from './handlers/ToolDefinitions.js';

export class ClimatiqMCPServer {
  private server: Server;
  private climatiqService: ClimatiqService;
  private toolHandlers: ToolHandlers;

  constructor() {
    this.server = new Server(
      {
        name: "climatiq-emissions-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    const climatiqApiKey = process.env.CLIMATIQ_API_KEY || "";
    this.climatiqService = new ClimatiqService(climatiqApiKey);
    this.toolHandlers = new ToolHandlers(this.climatiqService);
    
    this.setupHandlers();
  }

  private setupHandlers() {
    // Setup tool listing handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOL_DEFINITIONS,
    }));

    // Setup tool execution handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      return await this.toolHandlers.handleTool(name, args);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
} 