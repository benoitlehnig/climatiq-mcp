import axios from "axios";
import { 
  SearchEmissionFactorsArgs, 
  CalculateEmissionsArgs,
  SearchSummary,
  CalculationResult,
  ClimatiqSearchResponse,
  ClimatiqCalculationResponse,
  EmissionFactor as IEmissionFactor,
  SearchResult
} from '../types/index.js';
import { ParameterBuilder } from '../utils/ParameterBuilder.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { EmissionFactor } from '../models/EmissionFactor.js';
import { Calculation } from '../models/Calculation.js';

export class ClimatiqService {
  private apiKey: string;
  private baseUrl = "https://api.climatiq.io/data/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search for emission factors in the Climatiq database
   * @param args - Search parameters
   * @returns Formatted search results
   */
  async searchEmissionFactors(args: SearchEmissionFactorsArgs): Promise<SearchSummary> {
    if (!this.apiKey) {
      throw ErrorHandler.createMissingApiKeyError();
    }

    const { 
      query, 
      data_version = "^21", 
      year = 2021, 
      results_per_page = 5, 
      region, 
      category 
    } = args;

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
      
      const response = await axios.get<ClimatiqSearchResponse>(`${this.baseUrl}/search`, {
        params: params,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const results = response.data.results || [];
      
      // Format the results (include all results, even those with null factors)
      const formattedResults: SearchResult[] = results
        .map((result: IEmissionFactor, index: number) => ({
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
          ...(result.description && { description: result.description }),
        }));

      const summary: SearchSummary = {
        search_query: query,
        total_found: response.data.total_results || results.length,
        showing: formattedResults.length,
        results: formattedResults,
      };

      if (formattedResults.length > 0) {
        summary.best_match = formattedResults[0]!;
      }

      return summary;

    } catch (error) {
      throw ErrorHandler.handleClimatiqError(error, this.apiKey);
    }
  }

  /**
   * Calculate CO2 emissions using a specific emission factor
   * @param args - Calculation parameters
   * @returns Calculation results
   */
  async calculateEmissions(args: CalculateEmissionsArgs): Promise<CalculationResult> {
    if (!this.apiKey) {
      throw ErrorHandler.createMissingApiKeyError();
    }

    const { activity_id, data_version = "^21", amount, unit_type, unit,region  } = args;

    try {
      console.log(`Calculating emissions for: ${activity_id} with unit_type: ${unit_type}, region: ${region}` );

      // Build parameters based on the unit_type from search results
      const parameters = ParameterBuilder.buildParameters(unit_type, amount, unit);

      const requestBody = {
        emission_factor: {
          activity_id: activity_id,
          data_version: data_version,
        },
        parameters: parameters,
      };
      if (region) {
        (requestBody.emission_factor as any).region = region;
      }

      const response = await axios.post<ClimatiqCalculationResponse>(
        `${this.baseUrl}/estimate`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      const calculation = Calculation.fromApiResponse(result, activity_id, amount, unit);
      return calculation.toJSON();

    } catch (error) {
      throw ErrorHandler.handleClimatiqError(error, this.apiKey);
    }
  }
} 