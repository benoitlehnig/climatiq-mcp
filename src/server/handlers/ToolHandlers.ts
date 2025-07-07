import { ClimatiqService } from '../../services/ClimatiqService.js';
import { SearchEmissionFactorsArgs, CalculateEmissionsArgs } from '../../types/index.js';
import { ErrorHandler } from '../../utils/ErrorHandler.js';

export class ToolHandlers {
  private climatiqService: ClimatiqService;

  constructor(climatiqService: ClimatiqService) {
    this.climatiqService = climatiqService;
  }

  /**
   * Handle search emission factors tool request
   * @param args - Tool arguments
   * @returns Tool response
   */
  async handleSearchEmissionFactors(args: any) {
    const searchArgs: SearchEmissionFactorsArgs = {
      query: args.query,
      data_version: args.data_version,
      year: args.year,
      results_per_page: args.results_per_page,
      region: args.region,
      category: args.category,
    };

    const result = await this.climatiqService.searchEmissionFactors(searchArgs);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  /**
   * Handle calculate emissions tool request
   * @param args - Tool arguments
   * @returns Tool response
   */
  async handleCalculateEmissions(args: any) {
    const calculationArgs: CalculateEmissionsArgs = {
      activity_id: args.activity_id,
      data_version: args.data_version,
      amount: args.amount,
      unit_type: args.unit_type,
      unit: args.unit,
      region: args.region,
    };

    const result = await this.climatiqService.calculateEmissions(calculationArgs);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  /**
   * Route tool requests to appropriate handlers
   * @param name - Tool name
   * @param args - Tool arguments
   * @returns Tool response
   */
  async handleTool(name: string, args: any) {
    try {
      switch (name) {
        case "search_emission_factors":
          return await this.handleSearchEmissionFactors(args);
        case "calculate_emissions":
          return await this.handleCalculateEmissions(args);
        default:
          throw ErrorHandler.createUnknownToolError(name);
      }
    } catch (error) {
      throw ErrorHandler.createToolExecutionError(name, error);
    }
  }
} 