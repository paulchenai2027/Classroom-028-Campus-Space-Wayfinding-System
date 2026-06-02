export type OriginKey = 'east' | 'south' | 'west' | 'north' | 'north_side';

export interface OriginOption {
  key: OriginKey;
  label: string;
  distance: number; // in meters
  baseTime: number; // in minutes
  anxietyIndex: number[]; // array of 10 values representing mental anxiety curve
  timePoints: number[]; // array of time offsets matching the anxiety points
  congestions: number[]; // pedestrian density percentage curve
  steps: string[]; // step-by-step navigation instructions
  nodes: { x: number; y: number; label?: string }[]; // Coordinate path details
}
