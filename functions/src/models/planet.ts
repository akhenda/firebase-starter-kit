import { DatabaseService } from '@src/services';
import type { DocumentReference } from '@src/types';

export interface Planet {
  name: string;
  habitable: boolean;
  messages: DocumentReference[];
}

export const PlanetModel = new DatabaseService<Planet>('planets');
