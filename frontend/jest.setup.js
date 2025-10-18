import '@testing-library/jest-dom';
import 'jest-styled-components'; 

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

const originalConsoleError = console.error;
console.error = (...args) => {
  const ignorePatterns = [
    'Not implemented: HTMLCanvasElement.prototype.getContext',
    'Warning: An update to %s inside a test was not wrapped in act',
    'Error: useAuth must be used within an AuthProvider',
    'Error: useGame must be used within a GameProvider',
  ];

  if (typeof args[0] === 'string' && ignorePatterns.some(pattern => args[0].includes(pattern))) {
    return;
  }
  originalConsoleError(...args);
};