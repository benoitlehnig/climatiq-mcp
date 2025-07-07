export const TOOL_DEFINITIONS = [
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
]; 