import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage/AuthPage';
import Dashboard from '@/components/Dashboard/Dashboard';
import '@testing-library/jest-dom';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/components/AuthPage/AuthPage', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="auth-page-component">AuthPage</div>),
}));

jest.mock('@/components/Dashboard/Dashboard', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="dashboard-component">Dashboard</div>),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render "Carregando..." when auth context is loading', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: true });
    render(<Home />);
    expect(screen.getByText(/carregando.../i)).toBeInTheDocument();
    expect(screen.queryByTestId('auth-page-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-component')).not.toBeInTheDocument();
  });

  it('should render AuthPage when user is not authenticated and not loading', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    render(<Home />);
    expect(screen.getByTestId('auth-page-component')).toBeInTheDocument();
    expect(screen.queryByText(/carregando.../i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-component')).not.toBeInTheDocument();
  });

  it('should render Dashboard when user is authenticated and not loading', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false });
    render(<Home />);
    expect(screen.getByTestId('dashboard-component')).toBeInTheDocument();
    expect(screen.queryByText(/carregando.../i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('auth-page-component')).not.toBeInTheDocument();
  });
});
