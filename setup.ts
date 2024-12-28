import '@testing-library/jest-dom'; 
import { vi } from 'vitest';
import "vitest-canvas-mock"
import matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'
import '@testing-library/jest-dom/vitest';
import 'testing-library/jest-dom/extend-expect'




// Mock any global modules or APIs as needed.
global.fetch = vi.fn();
expect.extend(matchers)

