import { CalculationResult as ICalculationResult } from '../types/index.js';

export class Calculation implements ICalculationResult {
  public readonly calculation_id: string;
  public readonly emission_factor: {
    activity_id: string;
    name: string;
    factor: number | null;
    factor_unit: string | null;
    region: string;
    year: number;
    source: string;
  };
  public readonly activity_data: {
    amount: number;
    unit: string;
  };
  public readonly co2e_emissions: {
    total: number;
    unit: string;
  };
  public readonly breakdown: Record<string, any>;
  public readonly audit_trail: any[];

  constructor(data: ICalculationResult) {
    this.calculation_id = data.calculation_id;
    this.emission_factor = data.emission_factor;
    this.activity_data = data.activity_data;
    this.co2e_emissions = data.co2e_emissions;
    this.breakdown = data.breakdown;
    this.audit_trail = data.audit_trail;
  }

  /**
   * Get the total CO2e emissions as a formatted string
   */
  getEmissionsString(): string {
    return `${this.co2e_emissions.total} ${this.co2e_emissions.unit}`;
  }

  /**
   * Get the activity data as a formatted string
   */
  getActivityString(): string {
    return `${this.activity_data.amount} ${this.activity_data.unit}`;
  }

  /**
   * Get a summary of the calculation
   */
  getSummary(): string {
    return `${this.getActivityString()} of ${this.emission_factor.name} = ${this.getEmissionsString()}`;
  }

  /**
   * Check if there are constituent gases in the breakdown
   */
  hasBreakdown(): boolean {
    return Object.keys(this.breakdown).length > 0;
  }

  /**
   * Get the main constituent gases (CO2, CH4, N2O)
   */
  getMainGases(): Record<string, any> {
    const mainGases = ['CO2', 'CH4', 'N2O'];
    const result: Record<string, any> = {};
    
    for (const gas of mainGases) {
      if (this.breakdown[gas]) {
        result[gas] = this.breakdown[gas];
      }
    }
    
    return result;
  }

  /**
   * Convert to plain object
   */
  toJSON(): ICalculationResult {
    return {
      calculation_id: this.calculation_id,
      emission_factor: this.emission_factor,
      activity_data: this.activity_data,
      co2e_emissions: this.co2e_emissions,
      breakdown: this.breakdown,
      audit_trail: this.audit_trail,
    };
  }

  /**
   * Create from API response data
   */
  static fromApiResponse(data: any, activityId: string, amount: number, unit: string): Calculation {
    return new Calculation({
      calculation_id: data.id || "unknown",
      emission_factor: {
        activity_id: activityId,
        name: data.emission_factor?.name || "Unknown",
        factor: data.emission_factor?.factor,
        factor_unit: data.emission_factor?.factor_unit,
        region: data.emission_factor?.region,
        year: data.emission_factor?.year,
        source: data.emission_factor?.source,
      },
      activity_data: {
        amount: amount,
        unit: unit,
      },
      co2e_emissions: {
        total: data.co2e,
        unit: data.co2e_unit || "kg",
      },
      breakdown: data.constituent_gases || {},
      audit_trail: data.audit_trail || [],
    });
  }
} 