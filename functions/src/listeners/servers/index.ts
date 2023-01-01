import * as functions from 'firebase-functions';

import exampleServer from './example';
import planetsServer from './planets';

export const planets = functions.https.onRequest(planetsServer);
export const example = functions.https.onRequest(exampleServer);
