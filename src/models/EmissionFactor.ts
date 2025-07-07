import { EmissionFactor as IEmissionFactor } from '../types/index.js';

export class EmissionFactor implements IEmissionFactor {
  public readonly activity_id: string;
  public readonly name: string;
  public readonly category: string;
  public readonly factor: number | null;
  public readonly factor_unit: string | null;
  public readonly unit: string;
  public readonly unit_type: string;
  public readonly region: string;
  public readonly year: number;
  public readonly source: string;
  public readonly description?: string;

  constructor(data: IEmissionFactor) {
    this.activity_id = data.activity_id;
    this.name = data.name;
    this.category = data.category;
    this.factor = data.factor;
    this.factor_unit = data.factor_unit;
    this.unit = data.unit;
    this.unit_type = data.unit_type;
    this.region = data.region;
    this.year = data.year;
    this.source = data.source;
    if (data.description) {
      this.description = data.description;
    }
  }

  /**
   * Check if this emission factor has a valid factor value
   */
  hasFactor(): boolean {
    return this.factor !== null && this.factor !== undefined;
  }

  /**
   * Get a formatted string representation of the factor
   */
  getFactorString(): string {
    if (!this.hasFactor()) {
      return "No factor available";
    }
    return `${this.factor} ${this.factor_unit || 'kg CO2e'}`;
  }

  /**
   * Get a summary of the emission factor
   */
  getSummary(): string {
    return `${this.name} (${this.activity_id}) - ${this.getFactorString()}`;
  }

  /**
   * Convert to plain object
   */
  toJSON(): IEmissionFactor {
    return {
      activity_id: this.activity_id,
      name: this.name,
      category: this.category,
      factor: this.factor,
      factor_unit: this.factor_unit,
      unit: this.unit,
      unit_type: this.unit_type,
      region: this.region,
      year: this.year,
      source: this.source,
      ...(this.description && { description: this.description }),
    };
  }

  /**
   * Create from API response data
   */
  static fromApiResponse(data: any): EmissionFactor {
    return new EmissionFactor({
      activity_id: data.activity_id,
      name: data.name,
      category: data.category,
      factor: data.factor,
      factor_unit: data.factor_unit || null,
      unit: data.unit,
      unit_type: data.unit_type,
      region: data.region,
      year: data.year,
      source: data.source,
      description: data.description,
    });
  }
} 