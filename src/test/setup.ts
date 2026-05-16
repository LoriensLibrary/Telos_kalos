import '@testing-library/jest-dom/vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

// vitest-axe matchers — types augmented in ./vitest-axe.d.ts
expect.extend(axeMatchers);
