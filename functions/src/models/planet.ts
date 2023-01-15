import { DatabaseService } from '@src/services';
import type { DocumentReference } from '@src/types';

export interface Planet {
  id?: string;
  name: string;
  habitable: boolean;
  messages?: DocumentReference[];
}

export class PlanetSchema extends DatabaseService<Planet> {}

export const PlanetModel = new PlanetSchema('planets');
