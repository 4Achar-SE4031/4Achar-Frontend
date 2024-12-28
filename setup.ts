import '@testing-library/jest-dom'; 
import { vi } from 'vitest';
import "vitest-canvas-mock"


// Mock any global modules or APIs as needed.
global.fetch = vi.fn();
