import '@testing-library/jest-dom'; // Adds matchers like toBeInTheDocument().
import { vi } from 'vitest';
import "vitest-canvas-mock"

// Mock any global modules or APIs as needed.
global.fetch = vi.fn();
