import '@testing-library/jest-dom'; // Adds matchers like toBeInTheDocument().
import { vi } from 'vitest';

// Mock any global modules or APIs as needed.
global.fetch = vi.fn();
