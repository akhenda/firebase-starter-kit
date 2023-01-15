import { afterAllTests, beforeAllTests, beforeEachTest } from '@tests/__utils__/rules';

import usersTests from './users';

describe('Security Rules Unit Tests', () => {
  beforeAll(beforeAllTests);

  afterAll(afterAllTests);

  beforeEach(beforeEachTest);

  usersTests();
});
