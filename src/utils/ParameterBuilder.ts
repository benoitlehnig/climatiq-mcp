import { CalculationParameters } from '../types/index.js';

export class ParameterBuilder {
  /**
   * Builds the appropriate parameters object based on the unit type
   * @param unitType - The type of unit (e.g., 'Energy', 'Weight', 'Distance')
   * @param amount - The amount value
   * @param unit - The unit string
   * @returns The parameters object for the Climatiq API
   */
  static buildParameters(unitType: string, amount: number, unit: string): CalculationParameters {
    switch (unitType) {
      case "Energy":
        return {
          energy: amount,
          energy_unit: unit,
        };
      
      case "Weight":
        return {
          weight: amount,
          weight_unit: unit,
        };
      
      case "Distance":
        return {
          distance: amount,
          distance_unit: unit,
        };
      
      case "Area":
        return {
          area: amount,
          area_unit: unit,
        };
      
      case "Volume":
        return {
          volume: amount,
          volume_unit: unit,
        };
      
      case "Money":
        return {
          money: amount,
          money_unit: unit,
        };
      
      case "Power":
        return {
          power: amount,
          power_unit: unit,
        };
      
      case "Time":
        return {
          time: amount,
          time_unit: unit,
        };
      
      case "Data":
        return {
          data: amount,
          data_unit: unit,
        };
      
      case "Number":
        return {
          number: amount,
        };
      
      case "PassengerOverDistance":
        return {
          passengers: Math.round(amount), // Convert to integer for passengers
          distance: amount,
          distance_unit: unit,
        };
      
      case "WeightOverDistance":
        return {
          weight: amount,
          weight_unit: unit,
          distance: amount,
          distance_unit: unit,
        };
      
      case "WeightOverTime":
        return {
          weight: amount,
          weight_unit: unit,
          time: amount,
          time_unit: unit,
        };
      
      case "AreaOverTime":
        return {
          area: amount,
          area_unit: unit,
          time: amount,
          time_unit: unit,
        };
      
      case "DistanceOverTime":
        return {
          distance: amount,
          distance_unit: unit,
          time: amount,
          time_unit: unit,
        };
      
      case "DataOverTime":
        return {
          data: amount,
          data_unit: unit,
          time: amount,
          time_unit: unit,
        };
      
      case "NumberOverTime":
        return {
          number: amount,
          time: amount,
          time_unit: unit,
        };
      
      case "ContainerOverDistance":
        return {
          twenty_foot_equivalent: amount,
          distance: amount,
          distance_unit: unit,
        };
      
      default:
        // Fallback for unknown unit types
        console.error(`Unknown unit_type: ${unitType}, using fallback parameters`);
        return {
          [unit]: amount,
        };
    }
  }
} 