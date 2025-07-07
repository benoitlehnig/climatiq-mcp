// Climatiq API Types
export interface EmissionFactor {
  activity_id: string;
  name: string;
  category: string;
  factor: number | null;
  factor_unit: string | null;
  unit: string;
  unit_type: string;
  region: string;
  year: number;
  source: string;
  description?: string;
}

export interface SearchResult {
  rank: number;
  name: string;
  activity_id: string;
  category: string;
  factor: number | null;
  factor_unit: string | null;
  unit: string;
  unit_type: string;
  region: string;
  year: number;
  source: string;
  description?: string;
}

export interface SearchSummary {
  search_query: string;
  total_found: number;
  showing: number;
  results: SearchResult[];
  best_match?: SearchResult;
}

export interface CalculationResult {
  calculation_id: string;
  emission_factor: {
    activity_id: string;
    name: string;
    factor: number | null;
    factor_unit: string | null;
    region: string;
    year: number;
    source: string;
  };
  activity_data: {
    amount: number;
    unit: string;
  };
  co2e_emissions: {
    total: number;
    unit: string;
  };
  breakdown: Record<string, any>;
  audit_trail: any[];
}

// API Request Types
export interface SearchEmissionFactorsArgs {
  query: string;
  data_version?: string;
  year?: number;
  results_per_page?: number;
  region?: string;
  category?: string;
}

export interface CalculateEmissionsArgs {
  activity_id: string;
  data_version?: string;
  amount: number;
  unit_type: string;
  unit: string;
  region?: string;
}

// Parameter Types for different unit types
export interface EnergyParameters {
  energy: number;
  energy_unit: string;
}

export interface WeightParameters {
  weight: number;
  weight_unit: string;
}

export interface DistanceParameters {
  distance: number;
  distance_unit: string;
}

export interface AreaParameters {
  area: number;
  area_unit: string;
}

export interface VolumeParameters {
  volume: number;
  volume_unit: string;
}

export interface MoneyParameters {
  money: number;
  money_unit: string;
}

export interface PowerParameters {
  power: number;
  power_unit: string;
}

export interface TimeParameters {
  time: number;
  time_unit: string;
}

export interface DataParameters {
  data: number;
  data_unit: string;
}

export interface NumberParameters {
  number: number;
}

export interface PassengerOverDistanceParameters {
  passengers: number;
  distance: number;
  distance_unit: string;
}

export interface WeightOverDistanceParameters {
  weight: number;
  weight_unit: string;
  distance: number;
  distance_unit: string;
}

export interface WeightOverTimeParameters {
  weight: number;
  weight_unit: string;
  time: number;
  time_unit: string;
}

export interface AreaOverTimeParameters {
  area: number;
  area_unit: string;
  time: number;
  time_unit: string;
}

export interface DistanceOverTimeParameters {
  distance: number;
  distance_unit: string;
  time: number;
  time_unit: string;
}

export interface DataOverTimeParameters {
  data: number;
  data_unit: string;
  time: number;
  time_unit: string;
}

export interface NumberOverTimeParameters {
  number: number;
  time: number;
  time_unit: string;
}

export interface ContainerOverDistanceParameters {
  twenty_foot_equivalent: number;
  distance: number;
  distance_unit: string;
}

export type CalculationParameters = 
  | EnergyParameters
  | WeightParameters
  | DistanceParameters
  | AreaParameters
  | VolumeParameters
  | MoneyParameters
  | PowerParameters
  | TimeParameters
  | DataParameters
  | NumberParameters
  | PassengerOverDistanceParameters
  | WeightOverDistanceParameters
  | WeightOverTimeParameters
  | AreaOverTimeParameters
  | DistanceOverTimeParameters
  | DataOverTimeParameters
  | NumberOverTimeParameters
  | ContainerOverDistanceParameters
  | Record<string, any>;

// Climatiq API Response Types
export interface ClimatiqSearchResponse {
  results: EmissionFactor[];
  total_results: number;
}

export interface ClimatiqCalculationResponse {
  id: string;
  co2e: number;
  co2e_unit: string;
  emission_factor: {
    name: string;
    factor: number | null;
    factor_unit: string | null;
    region: string;
    year: number;
    source: string;
  };
  constituent_gases: Record<string, any>;
  audit_trail: any[];
} 