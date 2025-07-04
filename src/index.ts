import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

class ClimatiqMCPServer {
  private server: Server;
  private climatiqApiKey: string;

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

    this.climatiqApiKey = process.env.CLIMATIQ_API_KEY || "";
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "search_emission_factors",
          description: "Search for CO2 emission factors in the Climatiq database",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search term for emission factors (e.g., 'concrete', 'steel', 'electricity', 'truck transport')",
              },
              data_version: {
                type: "string",
                description: "Data version for the emission factors (e.g., '^21')",
                default: "^21",
              },
              year: {
                type: "number",
                description: "Year for the emission factors (e.g., 2021)",
                default: 2021,
              },
              results_per_page: {
                type: "number",
                description: "Maximum number of results to return per page (1-500)",
                default: 5,
                minimum: 1,
                maximum: 500,
              },
              region: {
                type: "string",
                description: "Region filter (e.g., 'US', 'EU', 'GB', 'GLO')",
              },
              category: {
                type: "string", 
                description: "Category filter (e.g., 'Materials', 'Energy', 'Metals')",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "calculate_emissions",
          description: "Calculate CO2 emissions using a specific emission factor. Use the activity_id, unit_type, and unit from search results.",
          inputSchema: {
            type: "object",
            properties: {
              activity_id: {
                type: "string",
                description: "The activity ID from search results (e.g., 'electricity-supply_grid-source_residual_mix')",
              },
              data_version: {
                type: "string",
                description: "Data version for the emission factor (e.g., '^21')",
                default: "^21",
              },
              amount: {
                type: "number",
                description: "The amount of the activity to calculate emissions for",
              },
              unit_type: {
                type: "string",
                description: "The unit_type from search results (e.g., 'Energy', 'Weight', 'Number', 'Distance'). This determines the parameter structure.",
              },
              unit: {
                type: "string",
                description: "The unit from search results (e.g., 'kWh', 'km', 'kg/number'). Use the unit field from the search result you want to use.",
              },
            },
            required: ["activity_id", "amount", "unit_type", "unit"],
          },
        },

      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (name === "search_emission_factors") {
          return await this.searchEmissionFactors(args);
        } else if (name === "calculate_emissions") {
          return await this.calculateEmissions(args);
        } else {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Tool ${name} not found`
          );
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${errorMessage}`
        );
      }
    });
  }

  private async searchEmissionFactors(args: any) {
    const { query, data_version = "^21", year = 2021, results_per_page = 5, region, category } = args;

    if (!this.climatiqApiKey) {
      throw new Error("Climatiq API key not configured. Please set CLIMATIQ_API_KEY environment variable.");
    }

    try {
      console.error(`Searching for: ${query}`);
      
      const params: any = {
        query: query,
        data_version: data_version,
        year: year,
        results_per_page: results_per_page,
      };

      // Add optional filters if provided
      if (region) params.region = region;
      if (category) params.category = category;
      
      const response = await axios.get("https://api.climatiq.io/data/v1/search", {
        params: params,
        headers: {
          Authorization: `Bearer ${this.climatiqApiKey}`,
          "Content-Type": "application/json",
        },
      });

      const results = response.data.results || [];
      
      // Format the results (include all results, even those with null factors)
      const formattedResults = results
        .map((result: any, index: number) => ({
          rank: index + 1,
          name: result.name,
          activity_id: result.activity_id,
          category: result.category,
          factor: result.factor,
          factor_unit: result.factor_unit || null,
          unit: result.unit,
          unit_type: result.unit_type,
          region: result.region,
          year: result.year,
          source: result.source,
          description: result.description,
        }));

      const summary: any = {
        search_query: query,
        total_found: response.data.total_results || results.length,
        showing: formattedResults.length,
        results: formattedResults,
      };

      if (formattedResults.length > 0) {
        summary.best_match = formattedResults[0];
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(summary, null, 2),
          },
        ],
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Climatiq API error:", (error as any).response?.data || errorMessage);
      
      if ((error as any).response) {
        const status = (error as any).response.status;
        const errorData = (error as any).response.data;
        
        // Mask API key for security (show first 4 and last 4 characters)
        const maskedApiKey = this.climatiqApiKey 
          ? `${this.climatiqApiKey.substring(0, 4)}...${this.climatiqApiKey.substring(this.climatiqApiKey.length - 4)}`
          : "NOT_SET";
        
        if (status === 401) {
          const serverError = errorData?.error || (error as any).response.statusText || "Unknown server error";
          throw new McpError(
            ErrorCode.InternalError,
            `Invalid Climatiq API key (${maskedApiKey}). Server response: ${serverError}. Please check your API key configuration.`
          );
        } else if (status === 403) {
          const serverError = errorData?.error || (error as any).response.statusText || "Unknown server error";
          throw new McpError(
            ErrorCode.InternalError,
            `Climatiq API access forbidden with key ${maskedApiKey}. Server response: ${serverError}. Check your API key permissions and subscription.`
          );
        } else if (status === 429) {
          const serverError = errorData?.error || (error as any).response.statusText || "Unknown server error";
          throw new McpError(
            ErrorCode.InternalError,
            `Climatiq API rate limit exceeded with key ${maskedApiKey}. Server response: ${serverError}. Please try again later or upgrade your plan.`
          );
        } else {
          const serverError = errorData?.error || (error as any).response.statusText || "Unknown server error";
          throw new McpError(
            ErrorCode.InternalError,
            `Climatiq API error (${status}) with key ${maskedApiKey}. Server response: ${serverError}. Full error data: ${JSON.stringify(errorData)}`
          );
        }
      } else {
        throw new McpError(
          ErrorCode.InternalError,
          `Network error: ${errorMessage}. API key used: ${this.climatiqApiKey ? "SET" : "NOT_SET"}`
        );
      }
    }
  }

  private async calculateEmissions(args: any) {
    const { activity_id, data_version = "^21", amount, unit_type, unit } = args;

    if (!this.climatiqApiKey) {
      throw new Error("Climatiq API key not configured. Please set CLIMATIQ_API_KEY environment variable.");
    }

    try {
      console.error(`Calculating emissions for: ${activity_id} with unit_type: ${unit_type}`);

      // Build parameters based on the unit_type from search results
      let parameters: any = {};
      
      // Determine parameter structure based on the unit_type
      switch (unit_type) {
        case "Energy":
          parameters = {
            energy: amount,
            energy_unit: unit,
          };
          break;
        case "Weight":
          parameters = {
            weight: amount,
            weight_unit: unit,
          };
          break;
        case "Distance":
          parameters = {
            distance: amount,
            distance_unit: unit,
          };
          break;
        case "Area":
          parameters = {
            area: amount,
            area_unit: unit,
          };
          break;
        case "Volume":
          parameters = {
            volume: amount,
            volume_unit: unit,
          };
          break;
        case "Money":
          parameters = {
            money: amount,
            money_unit: unit,
          };
          break;
        case "Power":
          parameters = {
            power: amount,
            power_unit: unit,
          };
          break;
        case "Time":
          parameters = {
            time: amount,
            time_unit: unit,
          };
          break;
        case "Data":
          parameters = {
            data: amount,
            data_unit: unit,
          };
          break;
        case "Number":
          parameters = {
            number: amount,
          };
          break;
        case "PassengerOverDistance":
          parameters = {
            passengers: Math.round(amount), // Convert to integer for passengers
            distance: amount,
            distance_unit: unit,
          };
          break;
        case "WeightOverDistance":
          parameters = {
            weight: amount,
            weight_unit: unit,
            distance: amount,
            distance_unit: unit,
          };
          break;
        case "WeightOverTime":
          parameters = {
            weight: amount,
            weight_unit: unit,
            time: amount,
            time_unit: unit,
          };
          break;
        case "AreaOverTime":
          parameters = {
            area: amount,
            area_unit: unit,
            time: amount,
            time_unit: unit,
          };
          break;
        case "DistanceOverTime":
          parameters = {
            distance: amount,
            distance_unit: unit,
            time: amount,
            time_unit: unit,
          };
          break;
        case "DataOverTime":
          parameters = {
            data: amount,
            data_unit: unit,
            time: amount,
            time_unit: unit,
          };
          break;
        case "NumberOverTime":
          parameters = {
            number: amount,
            time: amount,
            time_unit: unit,
          };
          break;
        case "ContainerOverDistance":
          parameters = {
            twenty_foot_equivalent: amount,
            distance: amount,
            distance_unit: unit,
          };
          break;
        default:
          // Fallback for unknown unit types
          parameters = {
            [unit]: amount,
          };
          console.error(`Unknown unit_type: ${unit_type}, using fallback parameters`);
      }

      const requestBody = {
        emission_factor: {
          activity_id: activity_id,
          data_version: data_version,
        },
        parameters: parameters,
      };

      const response = await axios.post(
        "https://api.climatiq.io/data/v1/estimate",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${this.climatiqApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      const calculation = {
        calculation_id: result.id || "unknown",
        emission_factor: {
          activity_id: activity_id,
          name: result.emission_factor?.name || "Unknown",
          factor: result.emission_factor?.factor,
          factor_unit: result.emission_factor?.factor_unit,
          region: result.emission_factor?.region,
          year: result.emission_factor?.year,
          source: result.emission_factor?.source,
        },
        activity_data: {
          amount: amount,
          unit: unit,
        },
        co2e_emissions: {
          total: result.co2e,
          unit: result.co2e_unit || "kg",
        },
        breakdown: result.constituent_gases || {},
        audit_trail: result.audit_trail || [],
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(calculation, null, 2),
          },
        ],
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Climatiq API error:", (error as any).response?.data || errorMessage);
      
      if ((error as any).response) {
        const status = (error as any).response.status;
        const errorData = (error as any).response.data;
        
        // Mask API key for security (show first 4 and last 4 characters)
        const maskedApiKey = this.climatiqApiKey 
          ? `${this.climatiqApiKey.substring(0, 4)}...${this.climatiqApiKey.substring(this.climatiqApiKey.length - 4)}`
          : "NOT_SET";
        
        if (status === 401) {
          const serverError = errorData?.error || (error as any).response.statusText || "Unknown server error";
          throw new McpError(
            ErrorCode.InternalError,
            `Invalid Climatiq API key (${maskedApiKey}). Server response: ${serverError}. Please check your API key configuration.`
          );
        } else if (status === 403) {
          const serverError = errorData?.error || (error as any).response.statusText || "Unknown server error";
          throw new McpError(
            ErrorCode.InternalError,
            `Climatiq API access forbidden with key ${maskedApiKey}. Server response: ${serverError}. Check your API key permissions and subscription.`
          );
        } else if (status === 429) {
          const serverError = errorData?.error || (error as any).response.statusText || "Unknown server error";
          throw new McpError(
            ErrorCode.InternalError,
            `Climatiq API rate limit exceeded with key ${maskedApiKey}. Server response: ${serverError}. Please try again later or upgrade your plan.`
          );
        } else {
          const serverError = errorData?.error || (error as any).response.statusText || "Unknown server error";
          throw new McpError(
            ErrorCode.InternalError,
            `Climatiq API error (${status}) with key ${maskedApiKey}. Server response: ${serverError}. Full error data: ${JSON.stringify(errorData)}`
          );
        }
      } else {
        throw new McpError(
          ErrorCode.InternalError,
          `Network error: ${errorMessage}. API key used: ${this.climatiqApiKey ? "SET" : "NOT_SET"}`
        );
      }
    }
  }





  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Climatiq MCP Server running on stdio");
  }
}

// Run the server
const server = new ClimatiqMCPServer();
server.run().catch(console.error);